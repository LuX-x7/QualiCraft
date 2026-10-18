"""UX55-02: only committed Bologna states may become recovery points."""
import concurrent.futures,contextlib,copy,json,sqlite3,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from qualicraft import core
from qualicraft.server import bologna_example


class SnapshotCommitTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.path=Path(self.tmp.name)/'qualicraft.sqlite3';self.store=core.Store(self.path);self.p=bologna_example();self.store.create(self.p);self.pid=self.p['id']
    def tearDown(self):self.tmp.cleanup()
    def snapshots(self):
        folder=self.store.backup_dir/self.pid
        return {p.name:p.read_bytes() for p in sorted(folder.glob('*.json'))}
    def raw(self):
        with contextlib.closing(sqlite3.connect(self.path)) as db:return json.loads(db.execute('SELECT data FROM projects WHERE id=?',(self.pid,)).fetchone()[0])
    def edit(self):self.store.change(self.pid,lambda p:core.event(p,'snapshot_commit_test',note='Public Bologna acceptance only'))

    def test_published_snapshot_already_has_a_committed_database_state(self):
        original=core.os.replace;observations=[]
        def observe(src,dst):
            candidate=json.loads(Path(src).read_text(encoding='utf-8'));observations.append(candidate==self.raw());return original(src,dst)
        with patch.object(core.os,'replace',side_effect=observe):self.edit()
        self.assertTrue(observations);self.assertTrue(all(observations),'A snapshot was published while its database state was uncommitted')

    def test_rollback_does_not_publish_or_prune_recovery_points(self):
        for _ in range(core.BACKUP_KEEP+2):self.edit()
        before=self.raw();backups=self.snapshots();connect=self.store.connect
        @contextlib.contextmanager
        def fail_before_commit():
            with connect() as db:
                yield db
                raise RuntimeError('Injected rollback before SQLite commit')
        with patch.object(self.store,'connect',fail_before_commit):
            with self.assertRaisesRegex(RuntimeError,'Injected rollback'):self.edit()
        self.assertEqual(self.raw(),before);self.assertEqual(self.snapshots(),backups,'A rolled-back edit altered the retained snapshots')

    def test_committed_pending_snapshot_retries_on_restart(self):
        before=self.snapshots()
        with patch.object(core.os,'replace',side_effect=OSError('Injected publication failure')):self.edit()
        saved=self.raw();self.assertNotEqual(saved,self.p);self.assertEqual(self.snapshots(),before)
        self.assertIsNotNone(self.store.backup_status()['error'])
        restarted=core.Store(self.path);rows=restarted.backups(self.pid)
        latest=json.loads((restarted.backup_dir/self.pid/rows[0]['name']).read_text(encoding='utf-8'))
        self.assertEqual(latest,saved,'A committed state lost its recovery point after process restart')
        self.assertTrue(set(before)<=set(self.snapshots()));self.assertIsNone(restarted.backup_status()['error'])

    def test_restart_after_rename_does_not_duplicate_the_committed_snapshot(self):
        original=core.os.replace
        def interrupted(src,dst):
            original(src,dst)
            raise RuntimeError('Injected stop after atomic rename, before receipt')
        try:
            with patch.object(core.os,'replace',side_effect=interrupted):self.edit()
        except RuntimeError:pass
        saved=self.raw();before=self.snapshots();core.Store(self.path)
        self.assertEqual(self.snapshots(),before,'Restart duplicated a file already atomically published')
        self.assertEqual(json.loads(before[sorted(before)[-1]]),saved)

    def test_direct_uncommitted_candidate_is_refused(self):
        candidate=copy.deepcopy(self.p);core.event(candidate,'uncommitted_candidate');before=self.snapshots()
        self.assertIsNone(self.store._snapshot(candidate));self.assertEqual(self.snapshots(),before);self.assertIsNotNone(self.store.backup_status()['error'])

    def test_multiple_pending_states_remain_immutable_and_recover_in_order(self):
        with patch.object(core.os,'replace',side_effect=OSError('Injected publication failure')):
            self.edit();first=self.raw();self.edit();second=self.raw()
        core.Store(self.path);snapshots=[json.loads(raw) for raw in self.snapshots().values()]
        self.assertEqual(snapshots,[self.p,first,second])

    def test_concurrent_store_instances_publish_each_committed_edit_once(self):
        other=core.Store(self.path)
        def edit(i):return [self.store,other][i%2].change(self.pid,lambda p:core.event(p,'parallel_snapshot',index=i))
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(edit,range(8)))
        self.assertEqual(len(self.raw()['audit'])-len(self.p['audit']),8)
        snapshots=[json.loads(raw) for raw in self.snapshots().values()]
        self.assertEqual(len(snapshots),9)
        self.assertEqual([len(p['audit'])-len(self.p['audit']) for p in snapshots],list(range(9)))

    def test_create_rollback_cannot_publish_a_new_project(self):
        candidate=bologna_example();connect=self.store.connect;before=self.snapshots()
        @contextlib.contextmanager
        def fail_before_commit():
            with connect() as db:
                yield db
                raise RuntimeError('Injected create rollback')
        with patch.object(self.store,'connect',fail_before_commit):
            with self.assertRaises(RuntimeError):self.store.create(candidate)
        self.assertFalse((self.store.backup_dir/candidate['id']).exists());self.assertEqual(self.snapshots(),before)
        with self.assertRaises(ValueError):self.store.get(candidate['id'])

    def test_legacy_files_are_preserved_and_numbering_continues(self):
        path=Path(self.tmp.name)/'legacy.sqlite3';folder=Path(self.tmp.name)/'legacy-backups'/self.pid;folder.mkdir(parents=True);payload=json.dumps(self.p,ensure_ascii=False,indent=1).encode();(folder/'000032.json').write_bytes(payload)
        with contextlib.closing(sqlite3.connect(path)) as db:
            db.execute('CREATE TABLE projects(id TEXT PRIMARY KEY,data TEXT NOT NULL)');db.execute('INSERT INTO projects VALUES (?,?)',(self.pid,json.dumps(self.p)));db.commit()
        store=core.Store(path,backup_dir=folder.parent);self.assertEqual((folder/'000032.json').read_bytes(),payload)
        store.change(self.pid,lambda p:core.event(p,'legacy_numbering_test'))
        self.assertEqual([p.name for p in sorted(folder.glob('*.json'))],['000032.json','000033.json']);self.assertEqual((folder/'000032.json').read_bytes(),payload)

    def test_restart_recovers_commit_before_publisher_was_called(self):
        before=self.snapshots()
        with patch.object(self.store,'_flush_snapshots'):self.edit()
        saved=self.raw();self.assertEqual(self.snapshots(),before)
        core.Store(self.path);self.assertEqual(json.loads(self.snapshots()[sorted(self.snapshots())[-1]]),saved)

    def test_collision_is_reported_without_overwriting_an_old_recovery_point(self):
        with patch.object(self.store,'_flush_snapshots'):self.edit()
        path=self.store.backup_dir/self.pid/'000002.json';preserved=json.dumps(self.p,ensure_ascii=False,indent=1).encode();path.write_bytes(preserved)
        restarted=core.Store(self.path);self.assertEqual(path.read_bytes(),preserved);self.assertIsNotNone(restarted.backup_status()['error'])

    def test_a_blocked_project_does_not_prevent_other_projects_being_protected(self):
        blocked=bologna_example();path=self.store.backup_dir/blocked['id'];path.write_text('Blocked directory test',encoding='utf-8');self.store.create(blocked)
        other=bologna_example();self.store.create(other)
        self.assertEqual(len(self.store.backups(other['id'])),1)
        self.assertEqual(self.store.backup_status()['error']['project_id'],blocked['id'])

if __name__=='__main__':unittest.main()
