"""Frozen report figures use only existing Bologna plotting bundles."""
import copy,io,json,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
from qualicraft import core,plotting,reporting
from tests.test_transcript_export import example

class ReportFigureTests(unittest.TestCase):
    def setUp(self):
        self.p=example();self.d=reporting.blank(self.p,'content')
        self.d['figures']=[{'id':'f1','caption':'Bologna technical count check','options':{'kind':'frequency','top':3}}]
    def save(self,**kw):
        body={'revision':self.p.get('research_report',{}).get('revision',0),'source_version':reporting.source_version(self.p),'draft':self.d};body.update(kw)
        return reporting.save(self.p,body)
    def test_saved_figures_freeze_existing_bytes_options_and_counts(self):
        state=self.save();b=state['current']['bindings']['figures']['f1'];asset=state['assets'][b['asset_id']]
        original,result=plotting.bundle(self.p,self.d['figures'][0]['options'])
        from qualicraft import report_figures
        self.assertEqual(report_figures.files(asset),original);self.assertEqual(asset['result'],result)
        self.assertEqual(b['source_version'],reporting.source_version(self.p))
        core.validate_project(self.p);self.assertEqual(core.validate_project(json.loads(json.dumps(self.p)))['research_report'],state)
    def test_caption_only_edits_reuse_shared_asset_and_restore_exact_versions(self):
        first=copy.deepcopy(self.save());self.d['figures'][0]['caption']='Edited caption'
        with patch.object(plotting,'bundle',side_effect=AssertionError('must reuse saved figure')):state=self.save()
        self.assertEqual(state['assets'],first['assets']);self.assertEqual(len(state['assets']),1)
        restored=reporting.save(self.p,{'revision':2,'version_id':first['current']['id']},restore=True)
        self.assertEqual(restored['current']['draft'],first['current']['draft']);self.assertEqual(restored['assets'],first['assets'])
    def test_stale_figures_require_explicit_refresh_and_failures_are_atomic(self):
        first=self.save();self.p['codes'][0]['name']+=' technical edit';before=copy.deepcopy(self.p)
        self.d['figures'][0]['options']['top']=4
        with self.assertRaises(ValueError):self.save()
        self.assertEqual(self.p,before)
        with patch.object(plotting,'bundle',side_effect=RuntimeError('technical failure')):
            with self.assertRaises(RuntimeError):self.save(refresh_evidence=True)
        self.assertEqual(self.p,before)
        state=self.save(refresh_evidence=True);self.assertFalse(reporting.context(self.p)['stale']);self.assertEqual(len(state['assets']),2)
    def test_invalid_paths_and_corrupt_assets_never_reach_plotting_or_restore(self):
        self.d['figures'][0]['options']['name']='../escape'
        with patch.object(plotting,'bundle',side_effect=AssertionError('must reject first')):
            with self.assertRaises(ValueError):self.save()
        self.assertNotIn('research_report',self.p)
        self.d['figures'][0]['options'].pop('name');state=self.save();asset=next(iter(state['assets'].values()));asset['bundle']='invalid'
        with self.assertRaises(ValueError):core.validate_project(self.p)
    def test_legacy_reports_remain_exact_and_html_word_zip_use_same_frozen_assets(self):
        legacy=reporting.blank(self.p,'content');reporting.save(self.p,{'revision':0,'source_version':reporting.source_version(self.p),'draft':legacy})
        self.assertNotIn('assets',self.p['research_report']);self.assertNotIn('figures',self.p['research_report']['current']['bindings'])
        state=self.save();entry=state['current'];assets=state['assets']
        html=reporting.html_export(entry,assets=assets).decode();self.assertIn('data:image/png;base64,',html);self.assertIn('Bologna technical count check',html)
        with zipfile.ZipFile(io.BytesIO(reporting.docx_export(entry,assets=assets))) as z:
            self.assertTrue(any(n.startswith('word/media/') for n in z.namelist()));self.assertIn(b'Bologna technical count check',z.read('word/document.xml'))
        package=reporting.bundle_export(entry,assets)
        with zipfile.ZipFile(io.BytesIO(package)) as z:
            self.assertIn('figures/f1/figure_data.csv',z.namelist());self.assertIn('figures/f1/figure.py',z.namelist())
            self.assertEqual(json.loads(z.read('report.json'))['report'],entry)
    def test_prepared_commit_rechecks_coding_revision_without_overwriting_reading(self):
        candidate=copy.deepcopy(self.p);state=reporting.save(candidate,{'revision':0,'source_version':reporting.source_version(candidate),'draft':self.d})
        stamp=reporting.source_version(self.p);self.p['documents'][0]['reading_state']['revision']+=1
        reporting.install_prepared(self.p,state,0,stamp);self.assertEqual(self.p['documents'][0]['reading_state']['revision'],1)
        before=copy.deepcopy(self.p)
        with self.assertRaises(reporting.ReportConflict):reporting.install_prepared(self.p,state,0,stamp)
        self.assertEqual(self.p,before)
        self.p['codes'][0]['name']+=' changed';before=copy.deepcopy(self.p)
        with self.assertRaises(reporting.ReportConflict):reporting.install_prepared(self.p,state,1,stamp)
        self.assertEqual(self.p,before)

    def test_capacity_and_figure_limits_fail_without_changing_state_or_audit(self):
        self.save();before=copy.deepcopy(self.p)
        self.d['figures']*=6
        with self.assertRaises(ValueError):self.save()
        self.assertEqual(self.p,before)
        self.d['figures']=self.d['figures'][:1]
        with patch.object(reporting,'validate_reading_capacity',side_effect=ValueError('capacity')):
            with self.assertRaises(ValueError):self.save()
        self.assertEqual(self.p,before)


class ReportFigureHTTPTests(unittest.TestCase):
    def test_render_outside_writer_lock_conflict_and_failure_preserve_saved_state(self):
        import tempfile,threading,urllib.request,urllib.error
        from qualicraft.server import create_server
        from qualicraft import report_figures
        with tempfile.TemporaryDirectory() as folder:
            p=example();store=core.Store(Path(folder)/'qualicraft.sqlite3');store.create(p)
            server=create_server(folder,folder,port=0);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            base='http://127.0.0.1:'+str(server.server_port);token=json.load(urllib.request.urlopen(base+'/api/bootstrap'))['token'];root=base+'/api/projects/'+p['id']
            def post(path,body):
                try:
                    r=urllib.request.urlopen(urllib.request.Request(root+path,data=json.dumps(body).encode(),headers={'Content-Type':'application/json','X-QualiCraft-Token':token}),timeout=10)
                    return r.status,json.load(r)
                except urllib.error.HTTPError as exc:return exc.code,json.load(exc)
            draft=reporting.blank(p,'content');draft['figures']=[{'id':'f1','caption':'Bologna technical check','options':{'kind':'frequency','top':3}}]
            asset_id,asset=report_figures.freeze(p,draft['figures'][0]['options']);started=threading.Event();release=threading.Event();output=[]
            def held(*args):started.set();self.assertTrue(release.wait(8));return asset_id,asset
            try:
                body={'revision':0,'source_version':reporting.source_version(p),'draft':draft}
                with patch.object(report_figures,'freeze',side_effect=held):
                    writer=threading.Thread(target=lambda:output.append(post('/report-save',body)));writer.start();self.assertTrue(started.wait(5))
                    try:
                        status,_=post('/code-update',{'id':p['codes'][0]['id'],'changes':{'name':p['codes'][0]['name']+' concurrent'}});self.assertEqual(status,200)
                        changed=store.get(p['id']);backups=store.backups(p['id'])
                    finally:release.set();writer.join(10)
                self.assertEqual(output[0][0],409);self.assertEqual(store.get(p['id']),changed);self.assertEqual(store.backups(p['id']),backups)
                body['source_version']=reporting.source_version(changed)
                with patch.object(report_figures,'freeze',side_effect=report_figures.FigureRenderError('Figure dependency unavailable')):
                    status,error=post('/report-save',body);self.assertEqual(status,500);self.assertIn('dependency unavailable',error['error'])
                self.assertEqual(store.get(p['id']),changed);self.assertEqual(store.backups(p['id']),backups)
            finally:release.set();server.shutdown();server.server_close();thread.join()


class WordFigurePackagingTests(unittest.TestCase):
    def test_long_original_png_has_contiguous_word_views_and_portable_package_namespaces(self):
        from qualicraft import report_figures
        from PIL import Image
        buffer=io.BytesIO();Image.new('RGB',(300,1500),'white').save(buffer,format='PNG');dimensions=buffer.getvalue()
        parts=report_figures.word_parts(dimensions);self.assertGreater(len(parts),1)
        self.assertEqual(parts[0][0],0);self.assertEqual(parts[-1][1],0)
        self.assertTrue(all(a[1]+b[0]==100000 for a,b in zip(parts,parts[1:])))
        from xml.etree import ElementTree as ET
        types=ET.Element('{http://schemas.openxmlformats.org/package/2006/content-types}Types');ET.SubElement(types,'{http://schemas.openxmlformats.org/package/2006/content-types}Default',{'Extension':'png','ContentType':'image/png'})
        value=report_figures.package_xml(types,'http://schemas.openxmlformats.org/package/2006/content-types')
        self.assertIn(b'<Types xmlns=',value);self.assertNotIn(b'ns0:',value)

if __name__=='__main__':unittest.main()
