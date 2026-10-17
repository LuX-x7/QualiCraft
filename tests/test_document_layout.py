"""Native source / report layout contracts using public Bologna only."""
import io,json,unittest,zipfile
from xml.etree import ElementTree as ET
from qualicraft import reporting,transcript,report_figures
from tests.test_transcript_export import example

W='{'+transcript.W+'}'
class DocumentLayoutTests(unittest.TestCase):
    def test_notebook_has_quiet_header_native_tree_and_page_navigation(self):
        data=transcript.freeze(example(),[example()['documents'][0]['id']],role_labels='theme-category-code')
        with zipfile.ZipFile(io.BytesIO(transcript.docx_export(data))) as z:
            root=ET.fromstring(z.read('word/document.xml'));plain=''.join(root.itertext())
            self.assertIn('Source notebook',plain)
            self.assertIn('word/footer1.xml',z.namelist());self.assertIn(b'PAGE',z.read('word/footer1.xml'))
            self.assertEqual(json.loads(ET.fromstring(z.read('customXml/item1.xml')).text),data)
            styles=ET.fromstring(z.read('word/styles.xml'));self.assertIsNotNone(styles.find("./"+W+"style[@"+W+"styleId='TreeName']"))
            self.assertTrue(root.findall('.//'+W+'tblBorders/'+W+'left'))
    def test_report_has_findings_chapter_and_separate_review_record(self):
        p=example();d=reporting.blank(p,'content');a=p['annotations'][0]
        d['rows']=[{'id':'row1','theme':'Materials','category':'Document form','code_ids':[a['code_id']],'evidence_ids':[a['id']],'interpretation':'Technical source check'}]
        d['narrative']='A technical check [E:'+a['id']+']'
        e=reporting.save(p,{'revision':0,'source_version':reporting.source_version(p),'draft':d})['current']
        with zipfile.ZipFile(io.BytesIO(reporting.docx_export(e))) as z:
            root=ET.fromstring(z.read('word/document.xml'));ps=root.findall('./'+W+'body/'+W+'p')
            texts=[transcript.word_plain(n) for n in ps]
            self.assertIn('Findings',texts);self.assertLess(texts.index('Findings'),texts.index('Narrative Analysis'))
            self.assertIn('Evidence appendix',texts);self.assertIn('Review record',texts)
            self.assertIn('word/footer1.xml',z.namelist())
            self.assertEqual(json.loads(ET.fromstring(z.read('customXml/item1.xml')).text),e)
    def test_inline_image_paragraph_does_not_inherit_body_line_spacing(self):
        # A minimal original PNG tests packaging and line layout without a plotting subprocess.
        from PIL import Image
        png=io.BytesIO();Image.new('RGB',(640,480),'white').save(png,format='PNG')
        empty={'project_name':'Bologna','documents':[],'association_count':0,'range_count':0,'include_memos':False,'project_id':'technical','schema_version':5,'version':'a'*64,'generated_at':'2026-10-17'}
        with zipfile.ZipFile(io.BytesIO(transcript.docx_export(empty))) as z:package={n:z.read(n) for n in z.namelist()}
        body=ET.Element(W+'body');report_figures.add_word_image(body,package,png.getvalue(),1,'Bologna figure')
        para=body.find(W+'p');spacing=para.find(W+'pPr/'+W+'spacing')
        self.assertIsNotNone(spacing);self.assertEqual(spacing.get(W+'line'),'240');self.assertEqual(spacing.get(W+'lineRule'),'auto')
        self.assertEqual(spacing.get(W+'before'),'0');self.assertEqual(spacing.get(W+'after'),'120')
        self.assertFalse(body.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}anchor'))

    def test_saved_figure_views_have_page_boundaries_and_complete_embedded_records(self):
        from unittest.mock import patch
        from PIL import Image
        p=example();draft=reporting.blank(p,'content')
        draft['figures']=[{'id':'f1','caption':'Bologna source check','options':{'kind':'frequency','top':3}}]
        state=reporting.save(p,{'revision':0,'source_version':reporting.source_version(p),'draft':draft})
        entry=state['current'];assets=state['assets'];ref=entry['bindings']['figures']['f1'];asset=assets[ref['asset_id']]
        png=io.BytesIO();Image.new('RGB',(300,1500),'white').save(png,format='PNG')
        with patch.object(report_figures,'files',return_value={asset['options']['name']+'.png':png.getvalue()}):
            payload=reporting.docx_export(entry,assets=assets)
        with zipfile.ZipFile(io.BytesIO(payload)) as z:
            root=ET.fromstring(z.read('word/document.xml'));ps=root.findall('./'+W+'body/'+W+'p')
            parts=report_figures.word_parts(png.getvalue())
            figure_heads=[para for para in ps if transcript.word_plain(para).startswith('Figure 1 · view ')]
            self.assertEqual(len(figure_heads),len(parts))
            self.assertTrue(all(para.find(W+'pPr/'+W+'pageBreakBefore') is not None for para in figure_heads[1:]))
            record=json.loads(ET.fromstring(z.read('customXml/item2.xml')).text)['f1']
            self.assertEqual(record,{'binding':ref,**{k:asset[k] for k in ['options','result','members','environment']}})
            images=[z.read(name) for name in z.namelist() if name.startswith('word/media/')]
            self.assertEqual(images,[png.getvalue()])

if __name__=='__main__':unittest.main()
