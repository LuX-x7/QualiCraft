import {test} from 'node:test'
import assert from 'node:assert/strict'
import {resolveSiteUrl} from '../website/lib/site/url.ts'

test('project-site routes and original assets retain the repository prefix',()=>{
 for(const path of ['/', '/report#sec-outputs','/report/frequency.svg','/worked-example/notebook.docx','/clips/coding.webm?v=a','/#method'])assert.equal(resolveSiteUrl(path,'/QualiCraft'),'/QualiCraft'+path)
 assert.equal(resolveSiteUrl('/QualiCraft/report','/QualiCraft'),'/QualiCraft/report')
})
test('workbench links go to the complete externally hosted app, preserving language and route',()=>{
 const target='https://qt.example/w/'
 assert.equal(resolveSiteUrl('/w?lang=en','/QualiCraft',target),'https://qt.example/w?lang=en')
 assert.equal(resolveSiteUrl('/w/api/bootstrap','/QualiCraft',target),'https://qt.example/w/api/bootstrap')
 assert.equal(resolveSiteUrl('/worked-example/notebook.html','/QualiCraft',target),'/QualiCraft/worked-example/notebook.html')
})
test('anchors, external links and embedded media are not changed',()=>{
 for(const value of ['#sec-frequency','https://example.com','mailto:hello@example.com','data:image/svg+xml,a','//example.com/file'])assert.equal(resolveSiteUrl(value,'/QualiCraft'),value)
})
test('existing root-mounted website and local workbench routes remain unchanged',()=>{
 for(const value of ['/w?lang=en','/report','/report/a.svg','/'])assert.equal(resolveSiteUrl(value),value)
})
