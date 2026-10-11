/* English unless the researcher asks otherwise. Following the browser locale
   silently put the whole interface in Chinese for anyone whose system is set
   to it, which is wrong for a tool shown to a supervisor or shared as a
   screenshot — the reader did not choose that. */
const QT_LANG=(()=>{const u=new URLSearchParams(location.search).get('lang');if(u){try{sessionStorage.setItem('qt_lang',u);}catch(e){}return u;}try{const s=sessionStorage.getItem('qt_lang');if(s)return s;}catch(e){}return 'en';})();
const _T={"en":{"loading":"Opening your local research workspace…","project":"PROJECT","switchProject":"Switch project","newProject":"+ New / import project","navCoding":"Coding workspace","navInsights":"Insights","navPlotting":"Figures","navAudit":"Audit trail","documents":"DOCUMENTS","codebook":"CODEBOOK","tools":"TOOLS","capabilityBlocks":"Capability blocks","localWorkspace":"Local workspace","noFileSelected":"No file selected","publicDemo":"Public demo","publicDemoNote":"Read-only sample project. Changes and uploads are disabled here; run QualiCraft locally to code your own material.","publicDemoReadOnly":"This public demonstration is read-only. Start a local copy to create or change projects.","publicDemoLocked":"Read-only demo. Run QualiCraft locally to make changes.","filterSidebar":"Filter documents and codes","noDocsFilter":"No documents match.","codeHits":"Codes matching","cloudNote":"Cloud only when requested","savedLocally":"Saved locally","model":"Model","export":"Export","switchLanguage":"Switch language","docCount":"documents","codeCount":"codes","codingCount":"codings","reviewCount":"to review","importInterview":"Import interview","mobileSwitch":"Switch / create project","footerBrand":"QUALICRAFT 0.1 · LOCAL WORKSPACE","footerTagline":"Exact source ranges · Researcher-reviewed coding","noDocEyebrow":"A SPACE FOR YOUR QUESTIONS","noDocTitle":"Start with a conversation","noDocBody":"Import TXT, DOCX, or paste a transcript.<br>Build a codebook, code by hand, or connect a model for suggestions.","noDocCreateCode":"Create code","searchDoc":"Search in document","documentLabel":"DOCUMENT","selectHint":"Select text to code a passage","newCode":"+ New code","analyzeAi":"Analyze with AI","readingNotes":"READING NOTES","readingPlaceholder":"First impressions, questions to follow up, anything that stands out.","aiReview":"AI REVIEW","suggestions":"Suggestions","reviewSubtitle":"Verify each interpretation against the source. A suggestion becomes a coding only after you accept it.","pending":"Pending review","reviewAccepted":"Accepted","reviewRejected":"Rejected","reviewFootnote":"Source ranges are verified automatically.<br>Interpretation remains your decision.","noCodes":"No codes yet. Add one to start coding.","noCodesFilter":"No codes to show.","noPassages":"No passages match your filters.","clearFilters":"Clear filters","human":"HUMAN","reference":"REFERENCE","aiReviewed":"AI · REVIEWED","demoSuggest":"DEMO SUGGESTION","aiSuggest":"AI SUGGESTION","locateQuote":"Locate this quotation in the source","rationale":"RATIONALE","acceptCoding":"Accept coding","reject":"Reject","acceptedState":"Accepted by researcher","rejectedState":"Rejected · decision recorded","noSuggestions":"No suggestions in this view","runAiOrChoose":"Run AI coding or choose another review status.","codeFreq":"Code frequency","network":"Relationship map","netLoading":"Building the map…","networkDesc":"Themes are the largest nodes, codes next, coded passages smallest. A dashed edge means two codes were applied to overlapping ranges in the same interview. That is descriptive — it is not correlation, and it is not a claim about a relationship. Click a theme to isolate its family, click a code to open its passages.","netOverlap":"codes overlapping in one interview","netClear":"Clear selection","freqDesc":"Each confirmed quotation–code link counts once. Frequency is not importance or a count of participants. Pending suggestions are excluded. For a figure you can put in a paper, use Figures.","docCodeMatrix":"Document × code","matrixDesc":"Export the complete matrix as CSV for further analysis and plotting.","applyCodesHint":"Apply codes to see your research take shape.","figures":"Figures","plotDesc":"The figure is drawn by a script on the server, not in the browser, so the preview you see is exactly what the exported script produces.","plotNotInstalled":"The plotting workbench is not installed","plotInstallHint":"Figures are drawn by a Python script rather than in the browser, so the same script can be exported and re-run by a co-author. Install it and reopen this view:","plotNotEnough":"Not enough codings yet","plotNeedTwo":"A figure needs at least two coded passages before there is anything to plot.","plotExportBtn":"Download figure + script","plotExportNote":"A folder with the counts as CSV, the script, and the figure as SVG, PDF and 300 dpi PNG.","auditTitle":"Provenance and activity","auditActions":"actions","snapshots":"snapshots","backupFailed":"Backup failed","snapshotsTitle":"Snapshots","snapshotsIntro":"A restorable copy is written after every change. Restoring one creates a new project and leaves this one untouched.","restoreCopy":"Restore as a copy","noSnapshots":"No snapshots yet.","backupHint":"A restorable copy is written after every change. Restore it from the Projects dialog.","auditDesc1":"Personal research project. When sharing your findings, document the data source, methods, and role of AI assistance.","auditDesc2":"Activity is saved locally and included in project exports. This is an editable research trail, not a tamper-proof log.","figKind":"Figure type","kindFrequency":"Code frequency","kindCoverage":"Code × interview","kindCooccurrence":"Co-occurrence heatmap","kindHierarchy":"Theme hierarchy","kindAccumulation":"Code accumulation","withinOverlap":"Overlapping text","withinPassage":"The same passage","topN":"Top N codes","groupBy":"Group by","countWithin":"Count within","palette":"Palette","optional":"Optional","clustering":"Clustering","linkage":"Linkage","showCounts":"Show counts","baseFontSize":"Base font size","titleOpt":"Title","on":"On","off":"Off","yes":"Yes","no":"No","pt":"pt","themes":"Themes","codes":"Codes","passages":"Passages","importDlg":"Import interview","importDesc":"Import UTF-8 TXT or DOCX, or paste a transcript. Original line breaks define segments. Use Doctor:/Patient:, Interviewer:/Participant:, or IQ.../IP1: speaker labels. Chinese labels are also supported.","chooseFile":"Choose a file","fileHint":"DOCX imports paragraph and table text; layout, comments, and headers are not retained.","docName":"Document name","docNamePlaceholder":"e.g. P02 · Care experience","pasteTranscript":"Or paste a transcript","pastePlaceholder":"Doctor: How did the conversation feel?\\nPatient: ...","importBtn":"Import locally","importOther":"Import a coding table","importOtherLink":"Already have a coding table from another tool?","importOtherDesc":"Already coded elsewhere? Drop the export here and QualiCraft will read it into a new project — transcripts, codebook and codings, with the source licence recorded.","importOtherFormats":"OpenQDA or NVivo CSV · QualCoder .zip · ATLAS.ti or FAIRqual .xlsx","importOtherName":"Project name (optional)","importOtherNamePh":"Defaults to the file name","importOtherBtn":"Import coding table","importNoFile":"Choose a file first.","importWorking":"Reading the file…","importDone":"Imported","cancel":"Cancel","toolsDlg":"Capability blocks","toolsDesc":"The core is always there: <strong>documents, codes and codings</strong>. Everything else is a block — click one to add it to this project and the interface grows to match. Click again to take it away. Which blocks a study used is stored with the project, so it becomes part of the record.","saveBlocks":"Save blocks","createCode":"Create code","codeName":"Code name","codeNamePlaceholder":"e.g. Information barriers","codeDef":"Definition and inclusion criteria","codeDefPlaceholder":"Describe when to use this code and when to exclude it.","groupUnder":"Group under (optional)","topLevel":"— top level —","groupHint":"Choosing a parent makes this a sub-code. Grouping codes under a theme is what turns a flat tag list into a codebook.","color":"Color","saveCode":"Save code","editCode":"Edit code","status":"Status","emergent":"Emergent","provisional":"Provisional","final":"Final","codeMemo":"Code / theme memo","codeMemoPlaceholder":"How is this code or theme developing?","inclusion":"Inclusion criteria","inclusionPlaceholder":"Use this code when…","exclusion":"Exclusion criteria","exclusionPlaceholder":"Do not use it when…","anchorExamples":"Anchor examples (one per line)","anchorPlaceholder":"Typical quotations that illustrate this code.","saveChanges":"Save changes","delete":"Delete","mergeInto":"Merge into…","deleteCode":"Delete code","mergeCode":"Merge code","codePassage":"Code this passage","selectCode":"Select a code","researchMemo":"Research memo","removeCoding":"Remove coding","saveMemo":"Save memo","memoPlaceholder":"Record your interpretation or a question for comparison.","applyCode":"Apply code","settingsTitle":"Cloud model settings","settingsDesc":"The launcher can read a local API_key.txt. Keys entered here stay in server memory only, outside browser storage, projects, and exports.","apiBase":"API Base URL","apiBaseHint":"Alibaba Cloud Beijing: https://dashscope.aliyuncs.com/compatible-mode/v1. A workspace-specific URL in the same region or another compatible endpoint also works.","modelName":"Model name","modelHint":"Default: qwen3.8-flash. When switching providers, update the endpoint, model, and key together.","apiKey":"API Key","apiKeyConfigured":"Configured; leave blank to keep the key for this endpoint","apiKeyPlaceholder":"Enter your key here, not in chat","settingsNotice":"Manual coding is free and works offline. Cloud analysis runs only after confirmation and may incur provider charges. De-identify real transcripts and confirm that sharing them with this provider is permitted.","saveSettings":"Save settings","clearKey":"Clear key","analyzeTitle":"AI-assisted coding","analyzeDesc":"Preview the exact request before running analysis. Results arrive as suggestions for your review.","codingApproach":"Coding approach","deductive":"Deductive · existing codes only","inductive":"Inductive · allow new codes","analysisScope":"Analysis scope","scopePatient":"Labeled patient / participant turns","scopeAll":"All non-empty text segments","includeContext":"Include the preceding doctor or interviewer question as context when speaker labels are recognized.","analyzeNotice":"Up to 200 requests per run. Long segments are split at 6,000 characters. Speaker identification relies on explicit labels. Check the preview before sending.","previewRequests":"Preview requests","reviewRequest":"Review cloud request","modelPrefix":"Model: ","requestsCount":" requests · ","targetChars":" target characters","previewNotice":"Requests include the listed text, selected context, complete codebook definitions, and system instructions. Canceling stops subsequent requests; in-flight requests may still incur charges.","viewFullRequest":"View full request bodies (","noCredentials":" segments, no credentials)","reviewConfirm":"I have reviewed the content. These texts are de-identified and may be shared with this provider.","back":"Back","sendAnalyze":"Send and analyze","projectsTitle":"Research projects","existingProjects":"Existing projects","openProject":"Open project","newProjectName":"New project name","newProjectPlaceholder":"e.g. Experiences of outpatient care","createProject":"Create project","groundedProject":"Tian 2021 · software architecture interviews","groundedDesc":"Import 8 semi-structured practitioner interviews. IP1–IP2 pair Chinese responses with English translations; IP3–IP8 are in English.","demoProject":"Fictional care interview","demoDesc":"Explore a fictional transcript, sample coding, and fixed review suggestions.","benchmarkProject":"TU Delft · blind workspace","benchmarkDesc":"Import 7 transcripts and 54 codes, without reference annotations.","referenceProject":"TU Delft · researcher reference","referenceDesc":"Explore 377 researcher annotations for comparison. These are not model predictions.","restoreProject":"Restore project JSON","restoreDesc":"Restore a backup as a new project while keeping the original.","guideNote":"Guide collections are imported from the local Guide directory and retain source provenance in the project audit trail.","exportTitle":"Export your research","exportDesc":"Files are saved to your browser download folder. Full project exports include source transcripts; handle them as research data.","exportJson":"Full project · JSON","exportJsonDesc":"Transcripts, codebook, codings, suggestions, and activity. Restore later to continue.","exportCsv":"Codings · CSV","exportCsvDesc":"Document, code, source quote, character offsets, memo, and provenance.","exportMatrix":"Document × code · CSV","exportMatrixDesc":"Confirmed codings only, ready for Excel, R, or Python.","exportMethods":"Methods record · Markdown","exportMethodsDesc":"How the analysis was actually carried out, assembled from your audit trail. Draft the methods section from it.","projectCreated":"Project created and saved locally.","blocksUpdated":"Capability blocks updated.","keyCleared":"Key cleared from memory.","settingsSaved":"Settings saved. No text has been sent.","confirmFirst":"Confirm the request content first.","analysisStarted":"Analysis started. Results will appear as suggestions.","cancelRequested":"Cancellation requested. The current request may still finish.","interviewImported":"Interview imported.","codeSaved":"Code saved.","codeUpdated":"Code updated.","passageCoded":"Passage coded.","toastAccepted":"Accepted and added to your codings.","toastRejected":"Rejected; review decision saved.","memoSaved":"Memo saved.","codingRemoved":"Coding removed; the previous record is retained in the audit trail.","figureExported":"Figure, counts and script exported.","exported":"Exported to your browser download folder.","confirmPreview":"Confirm the preview before sending data","jobRunning":"Analyzing","jobStopping":"Stopping","jobComplete":"Analysis complete","jobCancelled":"Analysis canceled","jobFailed":"Analysis interrupted","stopRemaining":"Stop remaining requests","workspaceError":"Could not open workspace: ","workspaceErrorHint":"Check that the local server is running, then refresh.","add":"Add","added":"Added","blocksCount":" services","direct":" direct · ","includingSub":" including sub-codes","subCode":" sub-code(s)","expand":"Expand","collapse":"Collapse","close":"Close","live":"live","inProgress":"in progress","notCovered":"Not covered yet","codingMargin":"CODING MARGIN","charactersLabel":" characters","segmentsLabel":" segments","codingsLabel":" codings"},"zh":{"loading":"正在打开本地研究工作台…","project":"项目","switchProject":"切换项目","newProject":"+ 新建 / 导入项目","navCoding":"编码工作区","navInsights":"洞察","navPlotting":"图表","navAudit":"审计记录","documents":"文档","codebook":"编码本","tools":"工具","capabilityBlocks":"功能模块","localWorkspace":"本地工作区","noFileSelected":"未选择文件","publicDemo":"公开演示","publicDemoNote":"只读示例项目。此处已关闭修改与上传；请在本机运行 QualiCraft 来编码你自己的材料。","publicDemoReadOnly":"这是只读公开演示。请启动本地副本来创建或修改项目。","publicDemoLocked":"只读演示。请在本机运行 QualiCraft 进行修改。","filterSidebar":"筛选文档与编码","noDocsFilter":"没有匹配的文档。","codeHits":"匹配的编码","cloudNote":"仅在请求时连接云端","savedLocally":"已本地保存","model":"模型","export":"导出","switchLanguage":"切换语言","docCount":"份文档","codeCount":"个编码","codingCount":"条标注","reviewCount":"待审核","importInterview":"导入访谈","mobileSwitch":"切换 / 创建项目","footerBrand":"QUALICRAFT 0.1 · 本地工作区","footerTagline":"精确源码范围 · 研究者审核编码","noDocEyebrow":"为您的研究问题留出空间","noDocTitle":"从一段对话开始","noDocBody":"导入 TXT、DOCX 或粘贴访谈稿。<br>建立编码本，手动编码，或连接模型获取建议。","noDocCreateCode":"创建编码","searchDoc":"在文档中搜索","documentLabel":"文档","selectHint":"选中文字即可为段落编码","newCode":"+ 新建编码","analyzeAi":"AI 分析","readingNotes":"阅读笔记","readingPlaceholder":"第一印象、待跟进的问题、任何引起注意的内容。","aiReview":"AI 审核","suggestions":"建议","reviewSubtitle":"逐一核对每个解释与原文的匹配度。建议只有经您确认后才会成为正式编码。","pending":"待审核","reviewAccepted":"已采纳","reviewRejected":"已拒绝","reviewFootnote":"源码范围已自动验证。<br>解释由您决定。","noCodes":"尚无编码。添加一个即可开始编码。","noCodesFilter":"没有可显示的编码。","noPassages":"没有匹配的段落。","clearFilters":"清除筛选","human":"人工","reference":"参考","aiReviewed":"AI · 已审核","demoSuggest":"演示建议","aiSuggest":"AI 建议","locateQuote":"在原文中定位此引用","rationale":"理由","acceptCoding":"采纳编码","reject":"拒绝","acceptedState":"已由研究者采纳","rejectedState":"已拒绝 · 决定已记录","noSuggestions":"此视图下没有建议","runAiOrChoose":"运行 AI 编码或选择其他审核状态。","codeFreq":"编码频率","network":"关系网图","netLoading":"正在生成关系图…","networkDesc":"主题是最大的节点，编码次之，被编码的文本片段最小。虚线表示两个编码被用在同一份访谈里区间重叠的地方。这是描述性的——不代表相关，也不构成关系判断。点击主题可只看它这一支，点击编码可展开它的文本片段。","netOverlap":"在同一份访谈中重叠的编码","netClear":"清除选择","freqDesc":"每条已确认的引用—编码链接计为一次。频率不代表重要性，也不代表受访者数量。待审核建议不计入。需要放进论文的图，请到「图表」页导出。","docCodeMatrix":"文档 × 编码","matrixDesc":"导出完整矩阵为 CSV，以便进一步分析和绘图。","applyCodesHint":"应用编码，让您的研究逐渐成形。","figures":"图表","plotDesc":"图表由服务器端脚本绘制，而非浏览器，因此您看到的预览与导出的脚本结果完全一致。","plotNotInstalled":"绘图工作台未安装","plotInstallHint":"图表由 Python 脚本绘制而非浏览器，因此同一脚本可被导出并由合作者重新运行。安装后重新打开此视图：","plotNotEnough":"编码数量不足","plotNeedTwo":"绘图需要至少两条已编码段落。","plotExportBtn":"下载图表 + 脚本","plotExportNote":"包含计数 CSV、脚本以及 SVG、PDF 和 300 dpi PNG 格式的图表。","auditTitle":"来源与活动","auditActions":"条操作","snapshots":"份快照","backupFailed":"备份失败","snapshotsTitle":"快照","snapshotsIntro":"每次改动后都会写一份可恢复的副本。恢复会新建一个项目，当前项目不受影响。","restoreCopy":"恢复为副本","noSnapshots":"还没有快照。","backupHint":"每次改动后都会写一份可恢复的副本。在「项目」对话框里恢复。","auditDesc1":"个人研究项目。分享研究结果时，请记录数据来源、方法和 AI 辅助的角色。","auditDesc2":"活动记录保存在本地，并包含在项目导出中。这是可编辑的研究记录，而非不可篡改的日志。","figKind":"图表类型","kindFrequency":"编码频率","kindCoverage":"编码 × 访谈","kindCooccurrence":"共现热力图","kindHierarchy":"主题层级","kindAccumulation":"编码累积","withinOverlap":"区间重叠","withinPassage":"同一段落","topN":"取前 N 个编码","groupBy":"分组方式","countWithin":"计数范围","palette":"配色","optional":"可选","clustering":"聚类","linkage":"连接方式","showCounts":"显示计数","baseFontSize":"基准字号","titleOpt":"标题","on":"开","off":"关","yes":"是","no":"否","pt":"磅","themes":"主题","codes":"编码","passages":"段落","importDlg":"导入访谈","importDesc":"导入 UTF-8 TXT 或 DOCX，或粘贴访谈稿。原始换行符定义段落。使用 Doctor:/Patient:、Interviewer:/Participant: 或 IQ.../IP1: 等说话人标签。中文标签也受支持。","chooseFile":"选择文件","fileHint":"DOCX 导入段落和表格文本；版式、批注和页眉不会被保留。","docName":"文档名称","docNamePlaceholder":"例如 P02 · 护理体验","pasteTranscript":"或粘贴访谈稿","pastePlaceholder":"医生：对话感觉如何？\\n患者：…","importBtn":"本地导入","importOther":"导入编码表","importOtherLink":"已经有别的工具导出的编码表？","importOtherDesc":"在别处编好码了？把导出文件放进来，QualiCraft 会把它读成一个新项目——转录、编码本和标注一起，并记下来源许可。","importOtherFormats":"OpenQDA 或 NVivo CSV · QualCoder .zip · ATLAS.ti 或 FAIRqual .xlsx","importOtherName":"项目名称（可选）","importOtherNamePh":"默认用文件名","importOtherBtn":"导入编码表","importNoFile":"请先选择一个文件。","importWorking":"正在读取文件…","importDone":"已导入","cancel":"取消","toolsDlg":"功能模块","toolsDesc":"核心功能始终可用：<strong>文档、编码和标注</strong>。其余均为模块——点击即可添加到本项目，界面会随之扩展。再次点击即可移除。研究使用了哪些模块会随项目一起保存，因此成为记录的一部分。","saveBlocks":"保存模块","createCode":"创建编码","codeName":"编码名称","codeNamePlaceholder":"例如 信息障碍","codeDef":"定义与纳入标准","codeDefPlaceholder":"描述何时使用此编码，何时排除。","groupUnder":"分组归属（可选）","topLevel":"— 顶级 —","groupHint":"选择父级会将此编码设为子编码。将编码归入主题下，才能把平面标签列表变成编码本。","color":"颜色","saveCode":"保存编码","editCode":"编辑编码","status":"状态","emergent":"涌现","provisional":"暂定","final":"最终","codeMemo":"编码 / 主题备忘录","codeMemoPlaceholder":"此编码或主题的发展情况如何？","inclusion":"纳入标准","inclusionPlaceholder":"在以下情况下使用此编码…","exclusion":"排除标准","exclusionPlaceholder":"在以下情况下不要使用…","anchorExamples":"锚点示例（每行一个）","anchorPlaceholder":"能说明此编码的典型引用。","saveChanges":"保存更改","delete":"删除","mergeInto":"合并到…","deleteCode":"删除编码","mergeCode":"合并编码","codePassage":"为段落编码","selectCode":"选择编码","researchMemo":"研究备忘录","removeCoding":"移除编码","saveMemo":"保存备忘录","memoPlaceholder":"记录您的解释或用于比较的问题。","applyCode":"应用编码","settingsTitle":"云端模型设置","settingsDesc":"启动器可以读取本地 API_key.txt。此处输入的密钥仅保存在服务器内存中，不会进入浏览器存储、项目或导出文件。","apiBase":"API 基础地址","apiBaseHint":"阿里云北京：https://dashscope.aliyuncs.com/compatible-mode/v1。同一区域或其他兼容端点的工作区专属地址也可以。","modelName":"模型名称","modelHint":"默认：qwen3.8-flash。切换提供商时，请同时更新端点、模型和密钥。","apiKey":"API 密钥","apiKeyConfigured":"已配置；留空可保留此端点的密钥","apiKeyPlaceholder":"在此输入密钥，不要在对话中发送","settingsNotice":"手动编码免费且可离线工作。云端分析仅在确认后运行，可能产生提供商费用。对真实访谈稿去标识化，并确认允许与提供商共享。","saveSettings":"保存设置","clearKey":"清除密钥","analyzeTitle":"AI 辅助编码","analyzeDesc":"运行分析前先预览具体请求。结果将以建议形式呈现供您审核。","codingApproach":"编码方式","deductive":"演绎 · 仅使用现有编码","inductive":"归纳 · 允许新建编码","analysisScope":"分析范围","scopePatient":"标记为患者 / 参与者的发言","scopeAll":"所有非空文本段落","includeContext":"识别到说话人标签时，将前面的医生或访谈者问题作为上下文包含在内。","analyzeNotice":"每次运行最多 200 条请求。长段落会在 6,000 字符处拆分。说话人识别依赖显式标签。发送前请先检查预览。","previewRequests":"预览请求","reviewRequest":"审核云端请求","modelPrefix":"模型：","requestsCount":" 条请求 · ","targetChars":" 目标字符","previewNotice":"请求包含所列文本、所选上下文、完整编码本定义和系统指令。取消会停止后续请求；进行中的请求可能仍会产生费用。","viewFullRequest":"查看完整请求内容（","noCredentials":" 个段落，不含凭证）","reviewConfirm":"我已审核内容。这些文本已去标识化，可以与此提供商共享。","back":"返回","sendAnalyze":"发送并分析","projectsTitle":"研究项目","existingProjects":"现有项目","openProject":"打开项目","newProjectName":"新项目名称","newProjectPlaceholder":"例如 门诊护理体验","createProject":"创建项目","groundedProject":"Tian 2021 · 软件架构访谈","groundedDesc":"导入 8 份半结构化从业者访谈。IP1–IP2 为中文回答配英文翻译；IP3–IP8 为英文。","demoProject":"虚构护理访谈","demoDesc":"探索一份虚构访谈稿、示例编码和固定的审核建议。","benchmarkProject":"代尔夫特理工 · 盲评工作区","benchmarkDesc":"导入 7 份访谈稿和 54 个编码，不含参考标注。","referenceProject":"代尔夫特理工 · 研究者参考","referenceDesc":"查看 377 条研究者标注以供比较。这些不是模型预测。","restoreProject":"恢复项目 JSON","restoreDesc":"将备份恢复为新项目，同时保留原始项目。","guideNote":"指南集从本地 Guide 目录导入，并在项目审计记录中保留来源出处。","exportTitle":"导出您的研究","exportDesc":"文件将保存到浏览器下载文件夹。完整项目导出包含源访谈稿；请按研究数据处理。","exportJson":"完整项目 · JSON","exportJsonDesc":"访谈稿、编码本、标注、建议和活动记录。后续可恢复继续工作。","exportCsv":"标注 · CSV","exportCsvDesc":"文档、编码、源引用、字符偏移、备忘录和来源。","exportMatrix":"文档 × 编码 · CSV","exportMatrixDesc":"仅包含已确认标注，可直接用于 Excel、R 或 Python。","exportMethods":"方法记录 · Markdown","exportMethodsDesc":"根据您的审计记录汇编实际执行的分析过程。可据此起草方法部分。","projectCreated":"项目已创建并保存在本地。","blocksUpdated":"功能模块已更新。","keyCleared":"密钥已从内存中清除。","settingsSaved":"设置已保存。尚未发送任何文本。","confirmFirst":"请先确认请求内容。","analysisStarted":"分析已开始。结果将以建议形式出现。","cancelRequested":"已请求取消。当前请求可能仍会完成。","interviewImported":"访谈已导入。","codeSaved":"编码已保存。","codeUpdated":"编码已更新。","passageCoded":"段落已编码。","toastAccepted":"已采纳并添加到您的标注中。","toastRejected":"已拒绝；审核决定已保存。","memoSaved":"备忘录已保存。","codingRemoved":"编码已移除；之前的记录保留在审计追踪中。","figureExported":"图表、计数和脚本已导出。","exported":"已导出到浏览器下载文件夹。","confirmPreview":"发送数据前请先确认预览","jobRunning":"分析中","jobStopping":"停止中","jobComplete":"分析完成","jobCancelled":"分析已取消","jobFailed":"分析中断","stopRemaining":"停止剩余请求","workspaceError":"无法打开工作区：","workspaceErrorHint":"请检查本地服务器是否正在运行，然后刷新页面。","add":"添加","added":"已添加","blocksCount":" 个服务","direct":" 直接 · ","includingSub":" 含子编码","subCode":" 个子编码","expand":"展开","collapse":"收起","close":"关闭","live":"在线","inProgress":"进行中","notCovered":"尚未覆盖","codingMargin":"编码边栏","charactersLabel":" 字符","segmentsLabel":" 段落","codingsLabel":" 编码"}};
function QT(k,fb){const d=_T[QT_LANG];return(d&&d[k])||fb||k;}
document.documentElement.lang = QT_LANG === 'zh' ? 'zh-CN' : 'en';
if(QT_LANG==='zh'){document.title='QualiCraft \u00b7 \u8d28\u6027\u7814\u7a76\u5de5\u4f5c\u53f0';}
'use strict';
const $ = (s, root = document) => root.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cp = s => Array.from(s);
const cut = (s, a, b) => cp(s).slice(a, b).join('');
const state = {token:'', projects:[], project:null, docId:null, view:'coding', search:'', codeFilter:null, selection:null, reviewFilter:'pending', config:{}, jobs:[], collapsed:new Set(), sideFilter:'', codebookOpen:false, backups:[], backupStatus:null};

// Capability blocks. The core (documents, codes, codings) is always on; these
// are opt-in, so a researcher assembles the tool they need. See docs/NOT_BUILDING.md.
const BLOCKS = [
  {id:'hierarchy', name:'Theme grouping', desc:'Group codes under themes. Turns the flat list into a collapsible tree with rolled-up counts.'},
  {id:'memos', name:'Memos', desc:'Reading notes on a document, notes on a code or theme, notes on a single coding.'},
  {id:'ai', name:'AI suggestions', desc:'A model proposes codings; each one arrives in a review queue and only enters the codebook if you accept it.'},
  {id:'insights', name:'Frequency analysis', desc:'How often each code was used, and a document by code matrix.'},
  {id:'audit', name:QT('navAudit','Audit trail'), desc:'Every action with a timestamp, stored with the project and included in exports.'},
  {id:'plotting', name:'Plotting workbench', desc:'Five figures — frequency, coverage, co-occurrence, hierarchy, accumulation — plus the script that drew the one you chose, so a co-author can re-run it. Needs matplotlib; scipy adds clustering.'}
];
function hasBlock(id) {
  const blocks = state.project && state.project.blocks;
  return Array.isArray(blocks) ? blocks.includes(id) : true;
}

// The public demo refuses every write on the server, but the interface used to
// offer the controls anyway: a visitor pressed Import, filled in the form, and
// only then met a refusal. The controls that start a write are now marked
// unavailable and say why, and `action()` refuses the rest as a safety net.
//
// They are dimmed rather than `disabled` on purpose — a disabled button takes
// no pointer events, so its tooltip never appears and the click says nothing.
const DEMO_LOCK = () => QT('publicDemoLocked', 'Read-only demo. Run QualiCraft locally to make changes.');
// Pass the tooltip the control would otherwise carry, so the demo replaces it
// rather than emitting a second `title` attribute.
const demoLock = (fallback = '') => state.config.public_demo
  ? ` data-locked="1" aria-disabled="true" title="${esc(DEMO_LOCK())}"`
  : (fallback ? ` title="${esc(fallback)}"` : '');
const WRITE_ACTIONS = new Set([
  'import', 'run-import', 'import-export-open', 'code', 'save-code', 'code-save',
  'code-delete', 'code-delete-ask', 'code-merge', 'code-merge-ask', 'save-document',
  'save-memo', 'save-annotation', 'annotate', 'annotation', 'remove-annotation',
  'save-blocks', 'new-project', 'restore-pick', 'review', 'analyze',
  'analyze-selection', 'start-analysis', 'popup-apply', 'popup-create',
  'demo-project', 'grounded-project', 'benchmark-project', 'reference-project',
]);
const icons = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart:'<path d="M4 3v17h17M8 16v-5m5 5V6m5 10v-8"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5L5 20"/>',
  history:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6m3-4v6l4 2"/>',
  doc:'<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8m-8 4h6"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  star:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
  setting:'<path d="M4 7h16M4 17h16M8 4v6m8 4v6"/>',
  down:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.doc}</svg>`;
let toastTimer, pollTimer;
function toast(message, error=false) { const el=$('#toast'); el.textContent=message; el.className='visible'+(error?' error':''); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.className='',6000); }
// When the workbench is proxied behind the site, /config.js sets QT_BASE to the
// prefix it is mounted at. Standalone, the base is empty and every path is root.
const QT_BASE = (typeof window !== 'undefined' && window.QT_BASE) || '';
async function api(path, body) {
  if (body && state.config.public_demo) {
    throw new Error(QT('publicDemoReadOnly', 'This public demonstration is read-only. Start a local copy to create or change projects.'));
  }
  const url = path.startsWith('/api') ? QT_BASE + path : path;
  const response = await fetch(url, {method:body ? 'POST':'GET', headers:{'X-QualiCraft-Token':state.token,...(body?{'Content-Type':'application/json'}:{})}, ...(body?{body:JSON.stringify(body)}:{})});
  const data = await response.json(); if(!response.ok) throw new Error(data.error || 'Request failed'); return data;
}
const projectUrl = action => `${QT_BASE}/api/projects/${state.project.id}${action?'/'+action:''}`;
const doc = () => state.project?.documents.find(d=>d.id===state.docId);
const codesFor = a => state.project.codes.find(c=>c.id===a.code_id);
function codePath(code) {
  const byId=new Map(state.project.codes.map(c=>[c.id,c]));
  const parts=[code.name]; let cur=code; const seen=new Set([code.id]);
  while(cur.parent_id && byId.has(cur.parent_id) && !seen.has(cur.parent_id)) {
    cur=byId.get(cur.parent_id); seen.add(cur.id); parts.push(cur.name);
  }
  return parts.reverse().join(' > ');
}
// The theme a code ultimately sits under — its topmost ancestor, or the code
// itself when it has none.
function themeOf(code) {
  const byId=new Map(state.project.codes.map(c=>[c.id,c]));
  let cur=code; const seen=new Set([code.id]);
  while(cur.parent_id && byId.has(cur.parent_id) && !seen.has(cur.parent_id)) {
    seen.add(cur.parent_id); cur=byId.get(cur.parent_id);
  }
  return cur;
}
// The coding margin, grouped by theme. Several screens into a transcript, a pill
// reading "The gym is not for me" is hard to place; the theme above it is what
// makes it legible again. A code with no parent is its own theme and gets no
// header, so a flat codebook looks exactly as it did.
function marginHtml(matches) {
  const groups=[];
  matches.forEach(a=>{
    const c=codesFor(a); if(!c) return;
    const theme=themeOf(c);
    let group=groups.find(g=>g.theme.id===theme.id);
    if(!group) groups.push(group={theme,items:[]});
    group.items.push({a,c});
  });
  return groups.map(({theme,items})=>{
    const header=items.some(({c})=>c.id!==theme.id)
      ? `<button class="margin-theme" data-action="filter-code" data-id="${theme.id}" title="${esc(theme.definition||theme.name)}"><span class="dot" style="background:${esc(theme.color)}"></span><span class="margin-theme-name">${esc(theme.name)}</span></button>`
      : '';
    return `<div class="margin-group">${header}${items.map(({a,c})=>`
      <button class="pill" style="--code-color:${esc(c.color)}" data-action="annotation" data-id="${a.id}">
        <span class="code-name">${esc(c.name)}</span>
        <span class="source">${a.source==='manual'?QT('human','HUMAN'):a.source==='researcher_reference'?QT('reference','REFERENCE'):QT('aiReviewed','AI · REVIEWED')}</span>
      </button>`).join('')}</div>`;
  }).join('');
}
function codeDescendants(id) {
  const out=new Set(); const stack=[id];
  while(stack.length) {
    const cur=stack.pop();
    state.project.codes.forEach(c=>{ if(c.parent_id===cur && !out.has(c.id)) { out.add(c.id); stack.push(c.id); } });
  }
  return out;
}
function codeDepthMap() {
  const byId=new Map(state.project.codes.map(c=>[c.id,c]));
  const depth=new Map();
  state.project.codes.forEach(c=>{
    let d=0, cur=c; const seen=new Set([c.id]);
    while(cur.parent_id && byId.has(cur.parent_id) && !seen.has(cur.parent_id)) {
      seen.add(cur.id); cur=byId.get(cur.parent_id); d++;
    }
    depth.set(c.id, d);
  });
  return depth;
}
function codeTree() {
  const byParent=new Map();
  state.project.codes.forEach(c=>{ const k=c.parent_id||null; if(!byParent.has(k)) byParent.set(k,[]); byParent.get(k).push(c); });
  byParent.forEach(list=>list.sort((a,b)=>(a.order??0)-(b.order??0)||a.name.localeCompare(b.name)));
  const rows=[];
  (function walk(parentId,depth){
    (byParent.get(parentId)||[]).forEach(c=>{
      const kids=byParent.get(c.id)||[];
      rows.push({code:c, depth, childCount:kids.length});
      if(kids.length && !state.collapsed.has(c.id)) walk(c.id, depth+1);
    });
  })(null,0);
  return rows;
}
function codeCounts() {
  const byId=new Map(state.project.codes.map(c=>[c.id,c]));
  const own=new Map(state.project.codes.map(c=>[c.id,0]));
  state.project.annotations.forEach(a=>{ if(own.has(a.code_id)) own.set(a.code_id, own.get(a.code_id)+1); });
  const total=new Map(own);
  state.project.codes.forEach(c=>{
    let cur=c.parent_id; const seen=new Set([c.id]);
    while(cur && byId.has(cur) && !seen.has(cur)) {
      seen.add(cur.id);
      total.set(cur, (total.get(cur)||0) + (own.get(c.id)||0));
      cur=byId.get(cur).parent_id;
    }
  });
  return {own, total};
}
function codebookHtml() {
  const p=state.project;
  if(!p.codes.length) return `<div class="empty">${QT('noCodes','No codes yet. Add one to start coding.')}</div>`;
  const {own,total}=codeCounts();
  const row=({code:c,depth,childCount})=>{
    const open=!state.collapsed.has(c.id);
    return `<div class="code-row" style="--depth:${depth}">
      <button class="twisty${childCount?'':' leaf'}" data-action="toggle-code" data-id="${c.id}" title="${childCount?(open?QT('collapse','Collapse'):QT('expand','Expand')):''}" aria-label="Toggle">${childCount?(open?'▾':'▸'):''}</button>
      <button class="side-item${state.codeFilter===c.id?' selected':''}" data-action="filter-code" data-id="${c.id}" title="${esc(c.definition||c.name)}">
        <span class="dot" style="background:${esc(c.color)}"></span>
        <span class="name">${esc(c.name)}${c.status!=='final'?`<span class="status-flag">${esc(c.status)}</span>`:''}</span>
        <span class="count" title="${own.get(c.id)||0} direct · ${total.get(c.id)||0} including sub-codes">${total.get(c.id)||0}</span>
      </button>
      <button class="edit-code" data-action="code-edit" data-id="${c.id}"${demoLock('Edit, re-parent, merge or delete')} aria-label="${QT('editCode','Edit code')}">⋯</button>
    </div>`;
  };

  // A filter answers a different question from the tree: "where is this code",
  // not "how does the codebook hang together". So matches are listed flat, with
  // their parent shown for context, rather than leaving a filtered tree whose
  // branches no longer mean anything.
  const needle=state.sideFilter.trim().toLowerCase();
  if(needle){
    const hits=p.codes.filter(c=>`${c.name} ${c.definition||''}`.toLowerCase().includes(needle));
    if(!hits.length) return `<div class="empty">${QT('noCodesFilter','No codes to show.')}</div>`;
    const byId=new Map(p.codes.map(c=>[c.id,c]));
    const parents=c=>{const path=[];let cur=byId.get(c.parent_id);const seen=new Set([c.id]);
      while(cur&&!seen.has(cur.id)){seen.add(cur.id);path.unshift(cur.name);cur=byId.get(cur.parent_id);}
      return path;};
    return `<div class="side-hits">${QT('codeHits','Codes matching')} ${hits.length} / ${p.codes.length}</div>`
      + hits.map(c=>`<div class="code-row" style="--depth:0">
        <button class="twisty leaf" aria-label="Toggle"></button>
        <button class="side-item${state.codeFilter===c.id?' selected':''}" data-action="filter-code" data-id="${c.id}" title="${esc(c.definition||c.name)}">
          <span class="dot" style="background:${esc(c.color)}"></span>
          <span class="name">${esc(c.name)}${c.status!=='final'?`<span class="status-flag">${esc(c.status)}</span>`:''}${parents(c).length?`<small class="code-parent">${esc(parents(c).join(' › '))}</small>`:''}</span>
          <span class="count" title="${own.get(c.id)||0} direct · ${total.get(c.id)||0} including sub-codes">${total.get(c.id)||0}</span>
        </button>
        <button class="edit-code" data-action="code-edit" data-id="${c.id}"${demoLock('Edit, re-parent, merge or delete')} aria-label="${QT('editCode','Edit code')}">⋯</button>
      </div>`).join('');
  }

  return codeTree().map(row).join('') || `<div class="empty">${QT('noCodesFilter','No codes to show.')}</div>`;
}
// The sidebar's own scroll, re-rendered on every keystroke in the filter box.
// Redrawing the whole app would take the caret out of the input.
function refreshSideList(){const el=$('#side-list');if(el)el.innerHTML=sideListHtml();}
function sideListHtml() {
  const p=state.project;
  const needle=state.sideFilter.trim().toLowerCase();
  const docs=needle?p.documents.filter(d=>d.name.toLowerCase().includes(needle)):p.documents;
  const total=p.codes.length;
  const open=state.codebookOpen||!!needle;
  return `<div class="side-title"><div class="section-label">${QT('documents','DOCUMENTS')} <span class="count">${docs.length}${docs.length!==p.documents.length?`/${p.documents.length}`:''}</span></div><button class="link" data-action="import"${demoLock()} aria-label="${QT('importDlg','Import interview')}">＋</button></div>
    ${docs.map(d=>`<button class="side-item ${d.id===state.docId?'selected':''}" data-action="doc" data-id="${d.id}" title="${esc(d.name)}">${icon('doc')}<span class="name">${esc(d.name)}</span></button>`).join('') || `<div class="empty">${QT('noDocsFilter','No documents match.')}</div>`}
    <div class="side-title"><button class="side-toggle" data-action="toggle-codebook" aria-expanded="${open}"><span class="twisty">${open?'▾':'▸'}</span>${QT('codebook','CODEBOOK')} <span class="count">${total}</span></button><button class="link" data-action="code"${demoLock()} aria-label="${QT('createCode','Create code')}">＋</button></div>
    ${open?codebookHtml():''}`;
}
function segments(text) {
  let speaker='unknown';
  return [...text.matchAll(/[^\r\n]+/gu)].filter(m=>m[0].trim()).map((m,i)=>{
    const label=m[0].match(/^\s*(患者|病人|受访者|Patient|Participant|Answer|IP\d+|P|A|医生|访谈者|采访者|Doctor|Interviewer|D|Q)\s*[:：]/i);
    if(label) speaker=/^(患者|病人|受访者|Patient|Participant|Answer|IP\d+|P|A)$/i.test(label[1])?'patient':'doctor';
    else if(/^\s*IQ\d+(?:\.\d+)*(?:\s*[:.]|\s*$)/i.test(m[0])) speaker='doctor';
    const start=cp(text.slice(0,m.index)).length;
    return {text:m[0], start, end:start+cp(m[0]).length, index:i, speaker};
  });
}
async function loadProject(id) {
  state.project=await api(`/api/projects/${id}`); state.docId=state.project.documents[0]?.id;
  state.selection=null; state.search=''; state.codeFilter=null; await loadBackups(); render();
}
// Snapshots are written on every change, so the indicator reports how many exist
// and when the last was taken. That is what tells the researcher something is
// looking after the file — a bare "Saved" claims a save without evidence.
async function loadBackups() {
  try {
    const r=await api(projectUrl('backups'));
    state.backups=r.items||[]; state.backupStatus=r.status||null;
  } catch(e) { /* keep the previous list */ }
}
// A count alone keeps looking healthy after writing has stopped, so the
// indicator reports the last failure instead when there is one.
function saveStateHtml() {
  const err=state.backupStatus&&state.backupStatus.error;
  if(err){
    return `<button class="save-state is-error" data-action="snapshots" title="${esc(err.message)}">${QT('backupFailed','Backup failed')}</button>`;
  }
  const n=state.backups.length;
  const label=QT('savedLocally','Saved locally')+(n?` · ${n} ${QT('snapshots','snapshots')}`:'');
  return `<button class="save-state" data-action="snapshots" title="${esc(QT('backupHint','A restorable copy is written after every change. Click to restore one as a copy.'))}">${label}</button>`;
}
async function refresh() {
  state.project=await api(projectUrl()); state.projects=await api('/api/projects'); await loadBackups(); render();
}
function showSnapshots() {
  const rows=state.backups.map(b=>{
    const when=new Date(b.written_at*1000).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'});
    return `<div class="snap-row"><span class="snap-name">${esc(b.name)}</span><span class="muted">${esc(when)} · ${Math.round(b.bytes/1024)} KB</span><button data-action="restore-snapshot" data-name="${esc(b.name)}"${demoLock()}>${QT('restoreCopy','Restore as a copy')}</button></div>`;
  }).join('');
  modal(QT('snapshotsTitle','Snapshots'),`<p>${QT('snapshotsIntro','A restorable copy is written after every change. Restoring one creates a new project and leaves this one untouched.')}</p>${rows||`<div class="empty">${QT('noSnapshots','No snapshots yet.')}</div>`}`);
}
function modal(title, body, footer='') {
  const dlg=$('#dialog'); dlg.innerHTML=`<div class="modal-head"><h2>${esc(title)}</h2><button data-action="close" aria-label="${QT('close','Close')}">×</button></div><div class="modal-body">${body}<div id="modal-error" role="alert"></div></div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;
  if(!dlg.open) dlg.showModal();
}
function closeModal() { $('#dialog').close(); $('#dialog').innerHTML=''; }
function errorDisplay(error) { if($('#dialog').open && $('#modal-error')) { $('#modal-error').className='inline-error'; $('#modal-error').textContent=error.message; } else toast(error.message,true); }
function render() {
  const p=state.project; if(!p) return;
  const pending=p.suggestions.filter(s=>s.status==='pending').length;
  const titles={coding:QT('navCoding','Coding workspace'),insights:QT('navInsights','Insights'),audit:QT('navAudit','Audit trail'),plotting:QT('navPlotting','Figures')};
  $('#app').innerHTML=`<div class="shell">
    <aside class="sidebar"><div class="brand"><span class="brand-icon">Q</span><span class="brand-name">QualiCraft</span><span class="version">ALPHA</span></div>
    <div class="section-label">${QT('project','PROJECT')}</div><select id="project-select" class="project-select" aria-label="${QT('switchProject','Switch project')}">${state.projects.map(x=>`<option value="${esc(x.id)}" ${x.id===p.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
    <button class="link new-project" data-action="projects">${QT('newProject','+ New / import project')}</button>
    <nav class="nav" aria-label="Main navigation">${[['coding','grid',QT('navCoding','Coding workspace')],['insights','chart',QT('navInsights','Insights')],['plotting','image',QT('figures','Figures')],['audit','history',QT('navAudit','Audit trail')]].filter(([view])=>view==='coding'||hasBlock(view)).map(([view,i,t])=>`<button class="${state.view===view?'active':''}" data-action="view" data-view="${view}" title="${t}">${icon(i)}<span class="nav-label">${t}</span></button>`).join('')}</nav>
    <div class="sidebar-scroll">
    <input id="side-filter" class="side-filter" type="search" autocomplete="off" spellcheck="false" aria-label="${QT('filterSidebar','Filter documents and codes')}" placeholder="${QT('filterSidebar','Filter documents and codes')}" value="${esc(state.sideFilter)}">
    <div id="side-list">${sideListHtml()}</div>
    <div class="side-title"><div class="section-label">${QT('tools','TOOLS')} <span class="count">${(p.blocks||[]).length}/${BLOCKS.length}</span></div></div><button class="side-item" data-action="tools" title="Add or remove capability blocks"><span class="tools-glyph">\u229e</span><span class="name">${QT('toolsDlg','Capability blocks')}</span><span class="count">${(p.blocks||[]).length}</span></button>
    </div><div class="local-note"><span class="status-dot"></span><div><strong>${QT('localWorkspace','Local workspace')}</strong><span>${QT('cloudNote','Cloud only when requested')}</span></div></div></aside>
    <main class="workspace"><header class="topbar"><div class="breadcrumb"><strong>${esc(p.name)}</strong><span>${titles[state.view]}</span></div><div class="top-actions">${saveStateHtml()}<button data-action="toggle-lang" title="${QT('switchLanguage','Switch language')}">${QT_LANG==='zh'?'EN':'中文'}</button><button data-action="settings">${icon('setting')}${QT('model','Model')}</button><button data-action="export">${icon('down')}${QT('export','Export')}</button><span class="avatar">QC</span></div></header>
    ${state.config.public_demo?`<div class="public-demo-banner" role="status"><strong>${QT('publicDemo','Public demo')}</strong><span>${QT('publicDemoNote','Read-only sample project. Changes and uploads are disabled here; run QualiCraft locally to code your own material.')}</span></div>`:''}
    <section class="project-strip"><div><h1>${esc(p.name)}</h1><div class="metrics"><span><b>${p.documents.length}</b> documents</span><span><b>${p.codes.length}</b> codes</span><span><b>${p.annotations.length}</b> codings</span><span class="pending-metric"><b>${pending}</b> ${QT('reviewCount','to review')}</span></div></div><button class="primary" data-action="import"${demoLock()}>${icon('upload')}${QT('importDlg','Import interview')}</button></section>
    <div id="job-status"></div><button class="link mobile-only" data-action="projects">${QT('mobileSwitch','Switch / create project')}</button>
    ${state.view==='coding'?codingView():state.view==='insights'?insightsView():state.view==='plotting'?plottingView():auditView()}
    <footer class="bottom-bar"><span>${QT('footerBrand','QUALICRAFT 0.1 · LOCAL WORKSPACE')}</span><span>${QT('footerTagline','Exact source ranges · Researcher-reviewed coding')}</span></footer></main></div>`;
  renderJob();
  loadPlotPreview();
  loadNetwork();
}
function highlight(text, start, annotations) {
  const chars=cp(text), end=start+chars.length;
  const relevant=annotations.filter(a=>a.start<end&&a.end>start);
  const bounds=[...new Set([start,end,...relevant.flatMap(a=>[Math.max(start,a.start),Math.min(end,a.end)])])].sort((a,b)=>a-b);
  return bounds.slice(0,-1).map((a,i)=>{
    const b=bounds[i+1], active=relevant.filter(x=>x.start<b&&x.end>a), part=esc(chars.slice(a-start,b-start).join(''));
    if(!active.length) return part;
    const activeCodes=active.map(x=>codesFor(x)).filter(Boolean);
    if(!activeCodes.length) return part;
    const depth=codeDepthMap();
    const shallow=activeCodes.reduce((m,c)=>((depth.get(c.id)||0)<(depth.get(m.id)||0)?c:m),activeCodes[0]);
    const deep=activeCodes.reduce((m,c)=>((depth.get(c.id)||0)>(depth.get(m.id)||0)?c:m),activeCodes[0]);
    return `<mark style="background:color-mix(in srgb,${esc(shallow.color)} 20%,#fff);border-bottom-color:${esc(deep.color)}" title="${esc(activeCodes.map(c=>c.name).join(' · '))}">${part}</mark>`;
  }).join('');
}

function codingView() {
  const d=doc(); if(!d) return `<div class="no-doc"><div class="eyebrow">${QT('noDocEyebrow','A SPACE FOR YOUR QUESTIONS')}</div><h2>${QT('noDocTitle','Start with a conversation')}</h2><p>Import TXT, DOCX, or paste a transcript.<br>Build a codebook, code by hand, or connect a model for suggestions.</p><button class="primary" data-action="import"${demoLock()}>${QT('importDlg','Import interview')}</button> <button data-action="code"${demoLock()}>${QT('createCode','Create code')}</button></div>`;
  return `<div class="tabs-bar"><div class="doc-tab">${icon('doc')}<span>${esc(d.name)}</span><span class="tab-close">×</span></div><input id="search" class="search" placeholder="${QT('searchDoc','Search in document')}" aria-label="Search transcript" value="${esc(state.search)}"></div>
  <div class="work-grid${hasBlock('ai')?'':' no-review'}"><section class="document-pane" id="document-pane" aria-label="Source transcript"><div class="document-tools"><div class="panel-kicker">${QT('documentLabel','DOCUMENT')}</div><div class="tool-group"><span class="selection-hint">${QT('selectHint','Select text to code a passage')}</span><button data-action="code"${demoLock()}>${QT('newCode','+ New code')}</button><button class="primary${hasBlock('ai')?'':' block-off'}" data-action="analyze"${demoLock()}>${icon('star')}${QT('analyzeAi','Analyze with AI')}</button></div></div>
  <div class="reader-header"><div><h2 class="reader-heading">${esc(d.name)}</h2><div class="reader-meta">${cp(d.text).length.toLocaleString()} characters · ${segments(d.text).length} segments · ${state.project.annotations.filter(a=>a.document_id===d.id).length} codings</div></div><div class="margin-label">${QT('codingMargin','CODING MARGIN')}</div></div>
  <div class="reading-note${hasBlock('memos')?'':' block-off'}"><span class="reading-note-label">${QT('readingNotes','READING NOTES')}</span><textarea id="doc-memo" rows="2" placeholder="${QT('readingPlaceholder','First impressions, questions to follow up, anything that stands out.')}">${esc(d.memo||'')}</textarea><span class="reading-note-state" id="doc-memo-state"></span></div>
  <div id="reader">${readerHtml()}</div></section><aside class="review-pane${hasBlock('ai')?'':' block-off'}" aria-label="AI suggestion review"><div class="review-header"><div class="panel-kicker">${QT('aiReview','AI REVIEW')}</div><div class="review-title"><h3>${QT('suggestions','Suggestions')}</h3><span class="count">${state.project.suggestions.filter(s=>s.document_id===d.id&&s.status==='pending').length}</span></div><p class="review-subtitle">${QT('reviewSubtitle','Verify each interpretation against the source. A suggestion becomes a coding only after you accept it.')}</p><select id="review-filter" class="review-filter" aria-label="Suggestion status">${[['pending',QT('pending','Pending review')],['accepted',QT('reviewAccepted','Accepted')],['rejected',QT('reviewRejected','Rejected')]].map(([v,t])=>`<option value="${v}" ${state.reviewFilter===v?'selected':''}>${t}</option>`).join('')}</select></div><div class="suggestion-list">${suggestionsHtml()}</div><div class="review-footnote">Source ranges are verified automatically.<br>Interpretation remains your decision.</div></aside></div>`;
}
function readerHtml() {
  const d=doc(), annotations=state.project.annotations.filter(a=>a.document_id===d.id);
  const paras=segments(d.text).filter(p=> (!state.search||p.text.toLocaleLowerCase().includes(state.search.toLocaleLowerCase())) && (!state.codeFilter||annotations.some(a=>a.code_id===state.codeFilter&&a.start<p.end&&a.end>p.start)));
  const filter=state.codeFilter?`<p class="tiny-label">Filter: ${esc(state.project.codes.find(c=>c.id===state.codeFilter)?.name)} <button class="link" data-action="clear-filter">${QT('clearFilters','Clear filters')}</button></p>`:'';
  return filter+(paras.map(p=>{
    const matches=annotations.filter(a=>a.start<p.end&&a.end>p.start);
    return `<div class="paragraph" data-start="${p.start}" data-end="${p.end}"><span class="line-no">${String(p.index+1).padStart(2,'0')}</span><div class="passage ${p.speaker==='doctor'?'doctor':''}" data-start="${p.start}">${highlight(p.text,p.start,annotations)}</div><div class="margin-tags">${marginHtml(matches)}</div></div>`;
  }).join('') || `<div class="empty">${QT('noPassages','No passages match your filters.')}<button class="link" data-action="clear-filter">${QT('clearFilters','Clear filters')}</button></div>`);
}
function suggestionsHtml() {
  const suggestions=state.project.suggestions.filter(s=>s.document_id===state.docId&&s.status===state.reviewFilter);
  return suggestions.map((s,i)=>`<article class="suggestion"><div class="card-eyebrow"><span>${s.source==='synthetic_demo'?QT('demoSuggest','DEMO SUGGESTION'):QT('aiSuggest','AI SUGGESTION')}</span><span>#${String(i+1).padStart(2,'0')}</span></div><h3>${esc(s.code_name)}</h3>${s.definition?`<p class="definition">${esc(s.definition)}</p>`:''}<button class="quote-btn" data-action="locate" data-start="${s.start}" title="${QT('locateQuote','Locate this quotation in the source')}"><span>“${esc(s.quote)}”</span><small>Source range [${s.start}, ${s.end}) · Locate ↗</small></button><div class="rationale-label">${QT('rationale','RATIONALE')}</div><p class="reason">${esc(s.rationale)}</p>${s.status==='pending'?`<div class="card-actions"><button class="primary" data-action="review" data-id="${s.id}" data-decision="accept"${demoLock()}>Accept coding</button><button data-action="review" data-id="${s.id}" data-decision="reject"${demoLock()}>Reject</button></div>`:`<small class="decision-state">${s.status==='accepted'?QT('acceptedState','Accepted by researcher'):QT('rejectedState','Rejected · decision recorded')}</small>`}</article>`).join('') || `<div class="empty"><span class="empty-symbol">◇</span><strong>${QT('noSuggestions','No suggestions in this view')}</strong><span>${QT('runAiOrChoose','Run AI coding or choose another review status.')}</span></div>`;
}
function insightsView() {
  const p=state.project, counts=p.codes.map(c=>({...c,count:p.annotations.filter(a=>a.code_id===c.id).length})).sort((a,b)=>b.count-a.count);
  const max=Math.max(1,...counts.map(c=>c.count));
  return `<div class="view-body"><section class="panel"><h2>${QT('codeFreq','Code frequency')}</h2><p>${QT('freqDesc','Each confirmed quotation–code link counts once. Frequency is not importance or a count of participants. Pending suggestions are excluded.')}</p>${counts.map(c=>`<div class="bar-row"><span>${esc(c.name)}</span><div class="bar-track"><div class="bar-value" style="width:${c.count/max*100}%;background:${esc(c.color)}"></div></div><b>${c.count}</b></div>`).join('')||`<div class="empty">${QT('applyCodesHint','Apply codes to see your research take shape.')}</div>`}</section><section class="panel"><h2>${QT('docCodeMatrix','Document × code')}</h2><p>${QT('matrixDesc','Export the complete matrix as CSV for further analysis and plotting.')}</p><div class="table-wrap"><table><thead><tr><th>Document</th>${p.codes.map(c=>`<th>${esc(c.name)}</th>`).join('')}</tr></thead><tbody>${p.documents.map(d=>`<tr><td>${esc(d.name)}</td>${p.codes.map(c=>`<td>${p.annotations.filter(a=>a.document_id===d.id&&a.code_id===c.id).length}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section><section class="panel"><h2>${QT('network','Relationship map')}</h2><p>${QT('networkDesc','Themes are the largest nodes, codes next, the coded passages smallest. A dashed edge means two codes were applied to overlapping ranges in the same interview. That is descriptive — it is not correlation, and it is not a claim about a relationship. Click a theme to isolate its family, click a code to open its passages.')}</p><div id="network-stage" class="network-stage"><div class="network-empty">${QT('netLoading','Building the map…')}</div></div><div id="network-legend" class="network-legend"></div></section></div>`;
}
let plotBlobUrl = null;
async function loadPlotPreview() {
  const img = document.getElementById('plot-preview');
  if (!img) return;
  if (plotBlobUrl) { URL.revokeObjectURL(plotBlobUrl); plotBlobUrl = null; }
  try {
    const response = await fetch(projectUrl('plot') + '?' + plotQuery(),
                                 {headers: {'X-QualiCraft-Token': state.token}});
    if (!response.ok) {
      const problem = await response.json().catch(() => ({error: 'The figure could not be produced.'}));
      throw new Error(problem.error || 'The figure could not be produced.');
    }
    plotBlobUrl = URL.createObjectURL(await response.blob());
    img.src = plotBlobUrl;
    img.classList.remove('loading');
  } catch (error) {
    const stage = img.parentElement;
    if (stage) stage.innerHTML = '<div class="plot-empty"><strong>Could not draw the figure</strong><p>'
      + esc(error.message) + '</p></div>';
  }
}
function plotQuery() {
  const o = state.plotOptions;
  const q = new URLSearchParams();
  Object.keys(o).forEach(k => { if (o[k] !== '' && o[k] !== null) q.set(k, String(o[k])); });
  return q.toString();
}
function plottingView() {
  const conf = state.config.plotting || {};
  if (!state.plotOptions) state.plotOptions = {kind:'frequency', level:'code', mode:'overlap',
    palette:'YlGnBu', cluster:1, method:'ward', annotate:1, top:15, title:'', fontsize:9};
  const o = state.plotOptions;
  const codings = state.project.annotations.length;
  const ready = conf.available && codings >= 2;
  const select = (key, choices) => '<select data-plot="' + key + '">'
    + choices.map(([v, label]) => '<option value="' + v + '"' + (String(o[key]) === String(v) ? ' selected' : '') + '>'
        + esc(label) + '</option>').join('') + '</select>';

  const field = (key, label, choices) => `<label class="field">${label}` + select(key, choices) + '</label>';
  const paletteNames = ['YlGnBu','viridis','Blues','Greens','magma','rocket','mako','flare','crest'];
  const kindChoices = [['frequency',QT('kindFrequency','Code frequency')],
    ['coverage',QT('kindCoverage','Code × interview')],
    ['cooccurrence',QT('kindCooccurrence','Co-occurrence heatmap')],
    ['hierarchy',QT('kindHierarchy','Theme hierarchy')],
    ['accumulation',QT('kindAccumulation','Code accumulation')]];
  const kindLabel = (kindChoices.find(([v]) => v === o.kind) || kindChoices[0])[1];
  const onOff = [['1',QT('on','On')],['0',QT('off','Off')]];

  // Only the controls the chosen figure actually reads. The panel used to show
  // all of them at once, so most of them looked broken: `level` and `unit` were
  // option names the server had stopped using, and a frequency bar chart has no
  // use for a palette or a clustering method.
  const controls = '<div class="plot-controls">'
    + field('kind', QT('figKind','Figure type'), kindChoices)
    + (o.kind === 'frequency'
        ? field('level', QT('groupBy','Group by'), [['code',QT('codes','Codes')],['theme',QT('themes','Themes')]])
        : '')
    + (o.kind === 'cooccurrence'
        ? field('mode', QT('countWithin','Count within'),
                [['overlap',QT('withinOverlap','Overlapping text')],['unit',QT('withinPassage','The same passage')]])
        : '')
    + (o.kind === 'coverage' || o.kind === 'cooccurrence'
        ? field('top', QT('topN','Top N codes'), [['10','10'],['15','15'],['20','20'],['30','30'],['40','40']])
        : '')
    + (o.kind === 'coverage' || o.kind === 'cooccurrence'
        ? field('palette', QT('palette','Palette'),
                paletteNames.map(n => [n, n === 'YlGnBu' ? n : n[0].toUpperCase() + n.slice(1)]))
        : '')
    + (o.kind === 'cooccurrence' ? field('cluster', QT('clustering','Clustering'), onOff) : '')
    + (o.kind === 'cooccurrence' ? field('method', QT('linkage','Linkage'), [['ward','Ward'],['complete','Complete'],['average','Average'],['single','Single']]) : '')
    + (o.kind === 'cooccurrence' ? field('annotate', QT('showCounts','Show counts'), [['1',QT('yes','Yes')],['0',QT('no','No')]]) : '')
    + `<label class="field">${QT('baseFontSize','Base font size')}<select data-plot="fontsize">`
      + [7,8,9,10,11,12].map(n => '<option value="' + n + '"' + (Number(o.fontsize) === n ? ' selected' : '') + '>' + n + ' pt</option>').join('')
      + '</select></label>'
    + `<label class="field">${QT('titleOpt','Title')}<input type="text" data-plot="title" value="` + esc(o.title) + `" placeholder="${QT('optional','Optional')}"></label>`
    + '</div>';

  const stage = !conf.available
    ? `<div class="plot-empty"><strong>${QT('plotNotInstalled','The plotting workbench is not installed')}</strong>`
      + `<p>${QT('plotInstallHint','Figures are drawn by a Python script rather than in the browser, so the same script can be exported and re-run by a co-author. Install it and reopen this view:')}</p>`
      + '<pre>' + esc(conf.install || 'pip install matplotlib') + '</pre></div>'
    : codings < 2
      ? `<div class="plot-empty"><strong>${QT('plotNotEnough','Not enough codings yet')}</strong><p>${QT('plotNeedTwo','A figure needs at least two coded passages before there is anything to plot.')}</p></div>`
      : '<img class="plot-preview loading" id="plot-preview" alt="' + esc(kindLabel) + '">';

  return `<div class="view-body"><section class="panel"><h2>${QT('navPlotting','Figures')}</h2>`
    + `<p>${QT('plotDesc','The figure is drawn by a script on the server, not in the browser, so the preview you see is exactly what the exported script produces.')}</p>`
    + '<div class="plot-grid">' + controls + '<div class="plot-stage">' + stage + '</div></div>'
    + '<div class="plot-actions">'
    + '<button class="primary" data-action="plot-export"' + (ready ? '' : ' disabled') + `>${QT('plotExportBtn','Download figure + script')}</button>`
    + `<span class="muted">${QT('plotExportNote','A folder with the counts as CSV, the script, and the figure as SVG, PDF and 300 dpi PNG.')}</span>`
    + '</div></section></div>';
}
const actionNames={document_import:'Document imported',code_create:QT('createCode','Create code'),annotation_create:'Coding created',suggestion_review:'Suggestion reviewed',analysis_start:'Analysis started',analysis_segment:'Segment analyzed',analysis_finish:'Analysis finished',benchmark_import:'Benchmark imported',annotation_remove:'Coding removed',memo_update:'Memo updated',project_restore:'Project restored'};
// The audit trail is one entry per action, so a study that coded 91 passages
// has 91 near-identical rows and the reader learns nothing from the list. The
// entries are grouped by day and consecutive runs of the same action collapse
// into one row, which is what makes the shape of a session visible — and each
// row still opens onto the full record.
function auditRuns() {
  const days=[];
  state.project.audit.slice().reverse().forEach(a=>{
    const when=new Date(a.time);
    const day=when.toISOString().slice(0,10);
    let bucket=days.find(d=>d.day===day);
    if(!bucket) days.push(bucket={day, runs:[], count:0});
    bucket.count++;
    const label=actionNames[a.action]||a.action;
    const last=bucket.runs[bucket.runs.length-1];
    if(last&&last.label===label) last.items.push(a);
    else bucket.runs.push({label, items:[a]});
  });
  return days;
}
function auditView() {
  const days=auditRuns();
  const total=state.project.audit.length;
  const kindCount=new Map();
  state.project.audit.forEach(a=>{const l=actionNames[a.action]||a.action; kindCount.set(l,(kindCount.get(l)||0)+1);});
  const summary=[...kindCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6)
    .map(([label,n])=>`<span class="audit-chip">${esc(label)} <b>${n}</b></span>`).join('');
  const body=days.map(d=>`<div class="audit-day"><div class="audit-day__head"><span>${esc(d.day)}</span><span class="muted">${d.count} ${QT('auditActions','actions')}</span></div>${d.runs.map(run=>{
    const first=new Date(run.items[0].time), last=new Date(run.items[run.items.length-1].time);
    const stamp=run.items.length>1
      ? `${first.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})} – ${last.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}`
      : first.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
    const names=run.items.length>1&&run.items.every(x=>x.code)
      ? `<span class="audit-names">${esc(run.items.slice(0,4).map(x=>x.code.name||x.code).join(' · '))}${run.items.length>4?` +${run.items.length-4}`:''}</span>` : '';
    return `<details class="audit-run"><summary><span>${esc(run.label)}${run.items.length>1?` <b class="audit-count">×${run.items.length}</b>`:''}</span><span class="muted">${esc(stamp)}</span></summary>${names}<pre>${esc(JSON.stringify(run.items.length===1?run.items[0]:run.items,null,2))}</pre></details>`;
  }).join('')}</div>`).join('');
  return `<div class="view-body"><section class="panel"><h2>${QT('auditTitle','Provenance and activity')}</h2><p>${esc(state.project.provenance||QT('auditDesc1','Personal research project. When sharing your findings, document the data source, methods, and role of AI assistance.'))}</p><p>${QT('auditDesc2','Activity is saved locally and included in project exports. This is an editable research trail, not a tamper-proof log.')}</p><div class="audit-summary"><span class="audit-total">${total} ${QT('auditActions','actions')}</span>${summary}</div>${body}</section></div>`;
}
function selectionUpdate() {
  const s=window.getSelection(); if(!s||s.isCollapsed||!s.rangeCount) return;
  const range=s.getRangeAt(0);
  const passage=node=>(node.nodeType===1?node:node.parentElement)?.closest('.passage');
  const first=passage(range.startContainer), last=passage(range.endContainer);
  if(!first||!last) return;
  function offset(el,node,pos){const r=document.createRange();r.selectNodeContents(el);r.setEnd(node,pos);return Number(el.dataset.start)+cp(r.toString()).length;}
  const start=offset(first,range.startContainer,range.startOffset), end=offset(last,range.endContainer,range.endOffset);
  if(start>=end) return;
  state.selection={start,end,document_id:state.docId};
  state.selectionRect=range.getBoundingClientRect();
  state.selectionSpansParagraphs=first!==last;
  markPendingSelection(range);
  showCodePopup();
}
let pendingRange=null;
function markPendingSelection(range) {
  if(!window.CSS||!CSS.highlights||typeof Highlight==='undefined') return;
  try { pendingRange=range.cloneRange(); CSS.highlights.set('pending', new Highlight(pendingRange)); } catch(e) {}
}
function clearPendingSelection() {
  pendingRange=null;
  if(window.CSS&&CSS.highlights) CSS.highlights.delete('pending');
}
function removeCodePopupDom() {
  const el=$('#code-popup'); if(el) el.remove();
}
function closeCodePopup() {
  removeCodePopupDom();
  clearPendingSelection();
}
function codePopupMatches(query) {
  const needle=query.trim().toLowerCase();
  const all=state.project.codes.map(c=>({code:c, path:codePath(c)}));
  if(!needle) return all.slice(0,8);
  return all.filter(x=>x.path.toLowerCase().includes(needle)).slice(0,8);
}
function showCodePopup() {
  removeCodePopupDom();
  const sel=state.selection; if(!sel) return;
  const host=document.createElement('div');
  host.id='code-popup';
  host.className='code-popup';
  host.innerHTML=`
    <div class="code-popup-row">
      <input id="code-search" type="text" autocomplete="off" spellcheck="false" placeholder="输入关键字，回车即打标">
      <button class="code-popup-x" data-action="close-popup" title="关闭 (Esc)">✕</button>
    </div>
    <div class="code-suggest" id="code-suggest"></div>
    <div class="code-popup-foot">
      <span class="code-popup-count">${sel.end-sel.start} 字符${state.selectionSpansParagraphs?'（跨段）':''}</span>
      <button data-action="annotate">更多选项…</button>
      <button data-action="analyze-selection">AI 分析</button>
    </div>`;
  document.body.appendChild(host);
  renderCodeSuggest('');
  positionCodePopup();
  setTimeout(positionCodePopup,120);
  setTimeout(positionCodePopup,320);
  const input=$('#code-search');
  if(input) {
    input.focus();
    input.addEventListener('input',e=>renderCodeSuggest(e.target.value));
    input.addEventListener('keydown',e=>{
      if(e.key==='Enter'){ e.preventDefault(); submitCodePopup(); }
      else if(e.key==='Escape'){ e.preventDefault(); closeCodePopup(); }
      else if(e.key==='ArrowDown'){ e.preventDefault(); movePopupCursor(1); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); movePopupCursor(-1); }
    });
  }
}
function positionCodePopup() {
  const host=$('#code-popup'); if(!host) return;
  const anchor=pendingRange?pendingRange.getBoundingClientRect():(state.selectionRect||null);
  if(!anchor||(!anchor.width&&!anchor.height)) return;
  const list=$('#code-suggest');
  const vw=window.innerWidth, vh=window.innerHeight, gap=8;
  const above=anchor.top-gap*2, below=vh-anchor.bottom-gap*2;
  const useBelow=below>=above;
  const room=Math.max(130,useBelow?below:above);
  if(list) {
    const chrome=host.getBoundingClientRect().height-(list.getBoundingClientRect().height||0);
    list.style.maxHeight=Math.max(56,Math.min(212,room-chrome))+'px';
  }
  const box=host.getBoundingClientRect();
  let left=anchor.left;
  if(left+box.width>vw-gap) left=Math.max(gap,vw-box.width-gap);
  if(left<gap) left=gap;
  let top=useBelow?anchor.bottom+gap:anchor.top-box.height-gap;
  top=Math.max(gap,Math.min(top,vh-box.height-gap));
  host.style.left=left+'px'; host.style.top=top+'px';
}
function renderCodeSuggest(query) {
  const box=$('#code-suggest'); if(!box) return;
  const needle=query.trim();
  const matches=codePopupMatches(needle);
  const depth=codeDepthMap();
  const exact=matches.some(m=>m.path.toLowerCase()===needle.toLowerCase());
  state.popupMatches=matches;
  state.popupCursor=0;
  const rows=matches.map((m,i)=>`<button class="suggest-row${i===0?' active':''}" data-action="popup-apply" data-id="${m.code.id}">
      <span class="dot" style="background:${esc(m.code.color)}"></span>
      <span class="suggest-name">${esc(m.path)}</span>
      ${(depth.get(m.code.id)||0)>0?'<span class="suggest-tag">子级</span>':''}
    </button>`).join('');
  const createRow=(needle&&!exact)
    ? `<button class="suggest-row create" data-action="popup-create" data-name="${esc(needle)}">＋ 新建编码「${esc(needle)}」并打标</button>`
    : '';
  box.innerHTML=(rows+createRow)||'<div class="suggest-empty">还没有编码，输入关键字即可新建</div>';
}
function movePopupCursor(delta) {
  const rows=[...document.querySelectorAll('#code-suggest .suggest-row')];
  if(!rows.length) return;
  const next=Math.max(0,Math.min(rows.length-1,(state.popupCursor||0)+delta));
  state.popupCursor=next;
  rows.forEach((r,i)=>r.classList.toggle('active',i===next));
  rows[next].scrollIntoView({block:'nearest'});
}
async function applyCodeById(codeId) {
  const sel=state.selection; if(!sel) return;
  await api(projectUrl('annotations'),{document_id:sel.document_id,start:sel.start,end:sel.end,code_id:codeId,memo:''});
  closeCodePopup(); state.selection=null;
  await refresh();
  toast('已打标。');
}
async function createAndApplyCode(name) {
  const code=await api(projectUrl(QT('codeCount','codes')),{name,definition:'',color:null});
  await refresh();
  await applyCodeById(code.id);
  toast(`已新建编码「${name}」并打标。`);
}
async function submitCodePopup() {
  const input=$('#code-search'); if(!input) return;
  const q=input.value.trim();
  const matches=state.popupMatches||[];
  const exact=matches.find(m=>m.path.toLowerCase()===q.toLowerCase());
  const pick=exact||matches[state.popupCursor||0];
  if(pick) return applyCodeById(pick.code.id);
  if(q) return createAndApplyCode(q);
  toast('先输入关键字，或从列表里选一个编码。',true);
}
function locate(start) {
  if(state.search||state.codeFilter){state.search='';state.codeFilter=null;render();}
  const para=[...document.querySelectorAll('.paragraph')].find(el=>Number(el.dataset.start)<=start&&Number(el.dataset.end)>start);
  if(para){para.scrollIntoView({behavior:'smooth',block:'center'});para.classList.add('flash');setTimeout(()=>para.classList.remove('flash'),1800);}
}
function showImport() {
  modal(QT('importDlg','Import interview'),`<p>${QT('importDesc','Import UTF-8 TXT or DOCX, or paste a transcript. Original line breaks define segments. Use Doctor:/Patient:, Interviewer:/Participant:, or IQ.../IP1: speaker labels. Chinese labels are also supported.')}</p><label class="field">${QT('chooseFile','Choose a file')}<span class="file-picker"><span class="file-picker-button">${QT('chooseFile','Choose a file')}</span><span class="file-picker-name" data-file-name="import-file">${QT('noFileSelected','No file selected')}</span><input id="import-file" type="file" accept=".txt,.docx" aria-label="${QT('chooseFile','Choose a file')}"></span><small>${QT('fileHint','DOCX imports paragraph and table text; layout, comments, and headers are not retained.')}</small></label><label class="field">${QT('docName','Document name')}<input id="document-name" placeholder="${QT('docNamePlaceholder','e.g. P02 · Care experience')}" maxlength="200"></label><label class="field">${QT('pasteTranscript','Or paste a transcript')}<textarea id="document-text" rows="9" placeholder="Doctor: How did the conversation feel?&#10;Patient: ..."></textarea></label>`, `<button class="link" data-action="import-export-open">${QT('importOtherLink','Already have a coding table from another tool?')}</button><button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="save-document">${QT('importBtn','Import locally')}</button>`);
}
/* A second path through the same dialog: another tool's coding export. The
   file is sent whole and the server works out which exporter produced it, so
   the researcher does not have to know that OpenQDA and NVivo both emit CSV. */
function showImportExport() {
  modal(QT('importOther','Import a coding table'), `<p>${QT('importOtherDesc','Already coded elsewhere? Drop the export here and QualiCraft will read it into a new project — transcripts, codebook and codings, with the source licence recorded.')}</p><label class="field">${QT('chooseFile','Choose a file')}<span class="file-picker"><span class="file-picker-button">${QT('chooseFile','Choose a file')}</span><span class="file-picker-name" data-file-name="import-export">${QT('noFileSelected','No file selected')}</span><input id="import-export" type="file" accept=".csv,.tsv,.zip,.xlsx" aria-label="${QT('chooseFile','Choose a file')}"></span><small>${QT('importOtherFormats','OpenQDA or NVivo CSV · QualCoder .zip · ATLAS.ti or FAIRqual .xlsx')}</small></label><label class="field">${QT('importOtherName','Project name (optional)')}<input id="import-name" maxlength="160" placeholder="${QT('importOtherNamePh','Defaults to the file name')}"></label><div id="import-status" class="muted"></div>`, `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="run-import">${QT('importOtherBtn','Import coding table')}</button>`);
}
async function runImport() {
  const input = document.getElementById('import-export');
  const status = document.getElementById('import-status');
  const file = input && input.files && input.files[0];
  if (!file) { if (status) status.textContent = QT('importNoFile', 'Choose a file first.'); return; }
  if (status) status.textContent = QT('importWorking', 'Reading the file…');
  try {
    const buffer = await file.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i += 8192) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    }
    const created = await api('/api/import', {
      filename: file.name,
      data: btoa(binary),
      name: (document.getElementById('import-name') || {}).value || '',
    });
    closeModal();
    state.projects = await api('/api/projects');
    state.project = created;
    state.docId = created.documents.length ? created.documents[0].id : null;
    render();
    toast(QT('importDone', 'Imported') + ': ' + created.documents.length + ' '
      + QT('docCount', 'documents') + ', ' + created.codes.length + ' '
      + QT('codeCount', 'codes') + ', ' + created.annotations.length + ' '
      + QT('codingCount', 'codings'));
  } catch (error) {
    if (status) status.textContent = error.message;
  }
}
function showTools() {
  const enabled = state.project.blocks || [];
  const bricks = BLOCKS.map(b => {
    const on = enabled.includes(b.id);
    return '<button type="button" class="brick' + (on ? ' on' : '') + '" data-block="' + b.id + '"'
      + ' aria-pressed="' + on + '">'
      + '<span class="brick-grip" aria-hidden="true"></span>'
      + '<span class="brick-body"><strong>' + esc(b.name) + '</strong>'
      + '<span>' + esc(b.desc) + '</span></span>'
      + '<span class="brick-state">' + (on ? QT('added','Added') : QT('add','Add')) + '</span></button>';
  }).join('');
  modal(QT('toolsDlg','Capability blocks'),
    '<p>The core is always there: <strong>documents, codes and codings</strong>. Everything else is a block — '
    + 'click one to add it to this project and the interface grows to match. Click again to take it away. '
    + 'Which blocks a study used is stored with the project, so it becomes part of the record.</p>'
    + '<div class="block-tray">' + bricks + '</div>',
    `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="save-blocks">${QT('saveBlocks','Save blocks')}</button>`);
}
function showCode(parentId=null) {
  const parents=state.project.codes;
  modal(QT('createCode','Create code'),`<label class="field">${QT('codeName','Code name')}<input id="code-name" maxlength="160" placeholder="${QT('codeNamePlaceholder','e.g. Information barriers')}"></label><label class="field">${QT('codeDef','Definition and inclusion criteria')}<textarea id="code-definition" rows="4" placeholder="${QT('codeDefPlaceholder','Describe when to use this code and when to exclude it.')}"></textarea></label>${parents.length&&hasBlock('hierarchy')?`<label class="field">${QT('groupUnder','Group under (optional)')}<select id="code-parent"><option value="">${QT('topLevel','— top level —')}</option>${parents.map(c=>`<option value="${c.id}" ${parentId===c.id?'selected':''}>${esc(codePath(c))}</option>`).join('')}</select><small>${QT('groupHint','Choosing a parent makes this a sub-code. Grouping codes under a theme is what turns a flat tag list into a codebook.')}</small></label>`:''}<label class="field">${QT('color','Color')}<input id="code-color" type="color" value="#427d77"></label>`, `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="save-code">${QT('saveCode','Save code')}</button>`);
}
function showCodeEdit(id) {
  const c=state.project.codes.find(x=>x.id===id); if(!c) return;
  const blocked=codeDescendants(id);
  const {own,total}=codeCounts();
  const others=state.project.codes.filter(x=>x.id!==id);
  modal(QT('editCode','Edit code'), `
    <label class="field">Name<input id="ec-name" maxlength="160" value="${esc(c.name)}"></label>
    <label class="field">Definition<textarea id="ec-definition" rows="3" placeholder="What this code means.">${esc(c.definition)}</textarea></label>
    <div class="form-row">
      <label class="field${hasBlock('hierarchy')?'':' block-off'}">Group under<select id="ec-parent"><option value="">${QT('topLevel','— top level —')}</option>${others.map(o=>`<option value="${o.id}"${c.parent_id===o.id?' selected':''}${blocked.has(o.id)?' disabled':''}>${esc(codePath(o))}${blocked.has(o.id)?' — its own sub-code':''}</option>`).join('')}</select></label>
      <label class="field">${QT('status','Status')}<select id="ec-status">${[['emergent',QT('emergent','Emergent')],['provisional',QT('provisional','Provisional')],['final',QT('final','Final')]].map(([v,t])=>`<option value="${v}"${c.status===v?' selected':''}>${t}</option>`).join('')}</select></label>
    </div>
    <label class="field${hasBlock('memos')?'':' block-off'}">Code / theme memo<textarea id="ec-memo" rows="3" placeholder="${QT('codeMemoPlaceholder','How is this code or theme developing?')}">${esc(c.memo||'')}</textarea></label>
    <div class="form-row">
      <label class="field">${QT('inclusion','Inclusion criteria')}<textarea id="ec-inclusion" rows="2" placeholder="${QT('inclusionPlaceholder','Use this code when…')}">${esc(c.inclusion||'')}</textarea></label>
      <label class="field">${QT('exclusion','Exclusion criteria')}<textarea id="ec-exclusion" rows="2" placeholder="${QT('exclusionPlaceholder','Do not use it when…')}">${esc(c.exclusion||'')}</textarea></label>
    </div>
    <label class="field">${QT('anchorExamples','Anchor examples (one per line)')}<textarea id="ec-anchors" rows="3" placeholder="${QT('anchorPlaceholder','Typical quotations that illustrate this code.')}">${esc((c.anchor_examples||[]).join('\n'))}</textarea></label>
    <label class="field">Colour<input id="ec-color" type="color" value="${esc(c.color)}"></label>
    <div class="notice">${own.get(id)||0} direct coding(s) · ${total.get(id)||0} including sub-codes · ${blocked.size} sub-code(s).</div>`,
    `<button class="danger" data-action="code-delete-ask" data-id="${id}">Delete</button>${others.length?`<button data-action="code-merge-ask" data-id="${id}">Merge into…</button>`:''}<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="code-save" data-id="${id}">Save changes</button>`);
}
function showCodeDeleteAsk(id) {
  const c=state.project.codes.find(x=>x.id===id); if(!c) return;
  const {own}=codeCounts();
  const kids=codeDescendants(id).size;
  modal(QT('deleteCode','Delete code'), `<p>${QT('delete','Delete')} <b>${esc(c.name)}</b>?</p>
    <div class="notice">${own.get(id)||0} coding(s) will be removed from the transcript.${kids?` ${kids} sub-code(s) will move up to the level above.`:''} The removal is written to the audit trail but cannot be undone from the interface.</div>`,
    `<button data-action="close">${QT('cancel','Cancel')}</button><button class="danger" data-action="code-delete" data-id="${id}">Delete code</button>`);
}
function showMergeAsk(id) {
  const src=state.project.codes.find(x=>x.id===id); if(!src) return;
  const others=state.project.codes.filter(x=>x.id!==id);
  modal(QT('mergeCode','Merge code'), `<p>Move every coding from <b>${esc(src.name)}</b> into another code, then remove it.</p>
    <label class="field">Merge into<select id="merge-target">${others.map(o=>`<option value="${o.id}">${esc(codePath(o))}</option>`).join('')}</select></label>
    <div class="notice">Sub-codes of <b>${esc(src.name)}</b> are re-parented to the target. A coding that would duplicate an existing target coding on the same passage is collapsed rather than copied.</div>`,
    `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="code-merge" data-id="${id}">Merge</button>`);
}
function showAnnotation() {
  if(!state.selection||state.selection.document_id!==state.docId) throw new Error('Select a passage in the transcript first.');
  if(!state.project.codes.length) {showCode();return;}
  modal(QT('codePassage','Code this passage'),`<blockquote class="big-quote">${esc(cut(doc().text,state.selection.start,state.selection.end))}</blockquote><label class="field">${QT('selectCode','Select a code')}<select id="annotation-code">${state.project.codes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label><label class="field${hasBlock('memos')?'':' block-off'}">Research memo (optional)<textarea id="annotation-memo" rows="3" placeholder="${QT('memoPlaceholder','Record your interpretation or a question for comparison.')}"></textarea></label>`, `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="save-annotation">${QT('applyCode','Apply code')}</button>`);
}
function showSettings() {
  modal(QT('settingsTitle','Cloud model settings'),`<p>${QT('settingsDesc','The launcher can read a local API_key.txt. Keys entered here stay in server memory only, outside browser storage, projects, and exports.')}</p><label class="field">${QT('apiBase','API Base URL')}<input id="api-base" value="${esc(state.config.base_url)}" spellcheck="false"><small>${QT('apiBaseHint','Alibaba Cloud Beijing: https://dashscope.aliyuncs.com/compatible-mode/v1. A workspace-specific URL in the same region or another compatible endpoint also works.')}</small></label><label class="field">${QT('modelName','Model name')}<input id="api-model" value="${esc(state.config.model)}" spellcheck="false"><small>${QT('modelHint','Default: qwen3.8-flash. When switching providers, update the endpoint, model, and key together.')}</small></label><label class="field">${QT('apiKey','API Key')}<input id="api-key" type="password" autocomplete="off" placeholder="${state.config.has_key?QT('apiKeyConfigured','Configured; leave blank to keep the key for this endpoint'):QT('apiKeyPlaceholder','Enter your key here, not in chat')}"></label><div class="notice">${QT('settingsNotice','Manual coding is free and works offline. Cloud analysis runs only after confirmation and may incur provider charges. De-identify real transcripts and confirm that sharing them with this provider is permitted.')}</div><a class="source-link" href="https://help.aliyun.com/zh/model-studio/compatibility-of-openai-with-dashscope" target="_blank" rel="noreferrer">Official Model Studio API documentation ↗</a>`, `<button data-action="clear-key">${QT('clearKey','Clear key')}</button><button class="primary" data-action="save-settings">${QT('saveSettings','Save settings')}</button>`);
}
function showAnalyze(forceSelection=false) {
  if(!doc()) throw new Error('Import an interview first.');
  const selected=state.selection?.document_id===state.docId;
  modal(QT('analyzeTitle','AI-assisted coding'),`<p>${QT('analyzeDesc','Preview the exact request before running analysis. Results arrive as suggestions for your review.')}</p><div class="form-row"><label class="field">${QT('codingApproach','Coding approach')}<select id="analysis-mode"><option value="deductive">${QT('deductive','Deductive · existing codes only')}</option><option value="inductive">${QT('inductive','Inductive · allow new codes')}</option></select></label><label class="field">${QT('analysisScope','Analysis scope')}<select id="analysis-scope"><option value="patient">${QT('scopePatient','Labeled patient / participant turns')}</option><option value="all">${QT('scopeAll','All non-empty text segments')}</option>${selected?`<option value="selection" ${forceSelection?'selected':''}>Selected passage (${state.selection.end-state.selection.start} characters)</option>`:''}</select></label></div><label class="check-row"><input id="include-context" type="checkbox" checked>${QT('includeContext','Include the preceding doctor or interviewer question as context when speaker labels are recognized.')}</label><div class="notice">${QT('analyzeNotice','Up to 200 requests per run. Long segments are split at 6,000 characters. Speaker identification relies on explicit labels. Check the preview before sending.')}</div>`, `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="preview-analysis">${QT('previewRequests','Preview requests')}</button>`);
}
let activePreview=null;
async function previewAnalysis() {
  const request={document_id:state.docId,mode:$('#analysis-mode').value,scope:$('#analysis-scope').value,include_context:$('#include-context').checked,...(state.selection||{})};
  activePreview=await api(projectUrl('preview'),request);
  const preview=activePreview;
  modal(QT('reviewRequest','Review cloud request'),`<p><b>${esc(preview.base_url)}</b><br>Model: ${esc(preview.model)} · ${preview.requests.length} requests · ${preview.segments.reduce((n,s)=>n+cp(s.text).length,0).toLocaleString()} target characters</p><div class="notice">${QT('previewNotice','Requests include the listed text, selected context, complete codebook definitions, and system instructions. Canceling stops subsequent requests; in-flight requests may still incur charges.')}</div><details class="preview-details"><summary>View full request bodies (${preview.requests.length} segments, no credentials)</summary>${preview.requests.map((r,i)=>`<details class="preview-details"><summary>Segment ${i+1} · source [${preview.segments[i].start}, ${preview.segments[i].end})</summary><pre class="preview-json">${esc(JSON.stringify(r,null,2))}</pre></details>`).join('')}</details><label class="check-row"><input id="send-confirm" type="checkbox">${QT('reviewConfirm','I have reviewed the content. These texts are de-identified and may be shared with this provider.')}</label>`, `<button data-action="close">${QT('back','Back')}</button><button class="primary" data-action="start-analysis" disabled>${QT('sendAnalyze','Send and analyze')}</button>`);
}
function showProjects() {
  modal(QT('projectsTitle','Research projects'),`<label class="field">${QT('existingProjects','Existing projects')}<select id="modal-project-select">${state.projects.map(p=>`<option value="${p.id}" ${p.id===state.project.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><button data-action="switch-project">${QT('openProject','Open project')}</button><hr style="border:0;border-top:1px solid #e3e7e2;margin:22px 0"><label class="field">${QT('newProjectName','New project name')}<input id="new-project-name" placeholder="${QT('newProjectPlaceholder','e.g. Experiences of outpatient care')}" maxlength="160"></label><button class="primary" data-action="new-project">${QT('createProject','Create project')}</button><div class="option-grid"><button class="option-card" data-action="grounded-project"><strong>${QT('groundedProject','Tian 2021 · software architecture interviews')}</strong><span>${QT('groundedDesc','Import 8 semi-structured practitioner interviews. IP1–IP2 pair Chinese responses with English translations; IP3–IP8 are in English.')}</span></button><button class="option-card" data-action="demo-project"><strong>${QT('demoProject','Fictional care interview')}</strong><span>${QT('demoDesc','Explore a fictional transcript, sample coding, and fixed review suggestions.')}</span></button><button class="option-card" data-action="benchmark-project"><strong>${QT('benchmarkProject','TU Delft · blind workspace')}</strong><span>${QT('benchmarkDesc','Import 7 transcripts and 54 codes, without reference annotations.')}</span></button><button class="option-card" data-action="reference-project"><strong>${QT('referenceProject','TU Delft · researcher reference')}</strong><span>${QT('referenceDesc','Explore 377 researcher annotations for comparison. These are not model predictions.')}</span></button><button class="option-card" data-action="restore-pick"><strong>${QT('restoreProject','Restore project JSON')}</strong><span>${QT('restoreDesc','Restore a backup as a new project while keeping the original.')}</span></button></div><input id="restore-file" type="file" accept=".json" hidden><p>${QT('guideNote','Guide collections are imported from the local Guide directory and retain source provenance in the project audit trail.')}</p>`);
}
function showExport() {
  modal(QT('exportTitle','Export your research'),`<p>${QT('exportDesc','Files are saved to your browser download folder. Full project exports include source transcripts; handle them as research data.')}</p><div class="option-grid"><button class="option-card" data-action="download" data-format="json"><strong>${QT('exportJson','Full project · JSON')}</strong><span>${QT('exportJsonDesc','Transcripts, codebook, codings, suggestions, and activity. Restore later to continue.')}</span></button><button class="option-card" data-action="download" data-format="csv"><strong>${QT('exportCsv','Codings · CSV')}</strong><span>${QT('exportCsvDesc','Document, code, source quote, character offsets, memo, and provenance.')}</span></button><button class="option-card" data-action="download" data-format="matrix"><strong>${QT('exportMatrix','Document × code · CSV')}</strong><span>${QT('exportMatrixDesc','Confirmed codings only, ready for Excel, R, or Python.')}</span></button><button class="option-card" data-action="download" data-format="methods"><strong>${QT('exportMethods','Methods record · Markdown')}</strong><span>${QT('exportMethodsDesc','How the analysis was actually carried out, assembled from your audit trail. Draft the methods section from it.')}</span></button></div>`);
}
async function createProject(body) {
  const p=await api('/api/projects',body); state.projects=await api('/api/projects'); closeModal(); state.view='coding'; await loadProject(p.id); toast(QT('projectCreated','Project created and saved locally.'));
}
async function action(button) {
  const a=button.dataset.action;
  if(state.config.public_demo&&WRITE_ACTIONS.has(a)){toast(DEMO_LOCK(),true);return;}
  if(a==='close'){closeModal();return;}
  if(a==='view'){state.view=button.dataset.view;state.selection=null;render();return;}
  if(a==='doc'){state.docId=button.dataset.id;state.selection=null;state.search='';state.codeFilter=null;state.view='coding';render();return;}
  if(a==='filter-code'){state.codeFilter=state.codeFilter===button.dataset.id?null:button.dataset.id;state.view='coding';render();return;}
  if(a==='toggle-code'){const id=button.dataset.id;state.collapsed.has(id)?state.collapsed.delete(id):state.collapsed.add(id);render();return;}
  if(a==='toggle-codebook'){state.codebookOpen=!state.codebookOpen;refreshSideList();return;}
  if(a==='code-edit')return showCodeEdit(button.dataset.id);
  if(a==='code-delete-ask')return showCodeDeleteAsk(button.dataset.id);
  if(a==='code-merge-ask')return showMergeAsk(button.dataset.id);
  if(a==='clear-filter'){state.codeFilter=null;state.search='';render();return;}
  if(a==='import')return showImport();
  if(a==='code')return showCode();
  if(a==='tools')return showTools();
  if(a==='save-blocks'){
    const picked=[...document.querySelectorAll('#dialog .brick.on')].map(x=>x.dataset.block);
    await api(projectUrl('blocks'),{blocks:picked});
    if(!picked.includes(state.view)&&state.view!=='coding')state.view='coding';
    closeModal();await refresh();
    toast(QT('blocksUpdated','Capability blocks updated.'));return;
  }
  if(a==='settings')return showSettings();
  if(a==='projects')return showProjects();
  if(a==='export')return showExport();
  if(a==='annotate'){closeCodePopup();return showAnnotation();}
  if(a==='analyze'||a==='analyze-selection'){closeCodePopup();return showAnalyze(a==='analyze-selection');}
  if(a==='close-popup'){closeCodePopup();return;}
  if(a==='popup-apply'){await applyCodeById(button.dataset.id);return;}
  if(a==='popup-create'){await createAndApplyCode(button.dataset.name);return;}
  if(a==='locate')return locate(Number(button.dataset.start));
  if(a==='preview-analysis')return previewAnalysis();
  if(a==='toggle-lang'){
    try{sessionStorage.setItem('qt_lang', QT_LANG==='zh'?'en':'zh');}catch(e){}
    location.assign(location.pathname+'?lang='+(QT_LANG==='zh'?'en':'zh'));
    return;
  }
  if(a==='snapshots')return showSnapshots();
  if(a==='restore-snapshot'){
    const name=button.dataset.name;
    const made=await api(projectUrl('restore-snapshot'),{name});
    closeModal(); await refresh(); toast(QT('restored','Restored as a new project.'));
    return;
  }
  if(a==='import-export-open')return showImportExport();
  if(a==='run-import')return runImport();
  if(a==='save-document'){
    const file=$('#import-file').files[0];
    const body={name:$('#document-name').value||file?.name,text:$('#document-text').value};
    if(file){if(file.size>8_000_000)throw new Error('File exceeds 8 MB.'); if(/\.docx$/i.test(file.name)){const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));body.docx_base64=btoa(binary);delete body.text;}else if(/\.txt$/i.test(file.name)){body.text=new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());}else throw new Error('Choose a TXT or DOCX file.');}
    const d=await api(projectUrl(QT('docCount','documents')),body);state.docId=d.id;state.selection=null;closeModal();await refresh();toast(QT('interviewImported','Interview imported.'));return;
  }
  if(a==='save-code'){await api(projectUrl(QT('codeCount','codes')),{name:$('#code-name').value,definition:$('#code-definition').value,color:$('#code-color').value,parent_id:$('#code-parent')?$('#code-parent').value||null:null});closeModal();await refresh();toast(QT('codeSaved','Code saved.'));return;}
  if(a==='code-save'){
    const id=button.dataset.id;
    await api(projectUrl('code-update'),{id,changes:{
      name:$('#ec-name').value, definition:$('#ec-definition').value, color:$('#ec-color').value,
      parent_id:$('#ec-parent').value||null, status:$('#ec-status').value, memo:$('#ec-memo').value,
      inclusion:$('#ec-inclusion').value, exclusion:$('#ec-exclusion').value,
      anchor_examples:$('#ec-anchors').value.split('\n').map(x=>x.trim()).filter(Boolean)}});
    closeModal();await refresh();toast(QT('codeUpdated','Code updated.'));return;
  }
  if(a==='code-delete'){
    const id=button.dataset.id;
    const result=await api(projectUrl('code-delete'),{id});
    if(state.codeFilter===id)state.codeFilter=null;
    closeModal();await refresh();
    toast(`Deleted “${result.name}” · ${result.codings_removed} coding(s) removed${result.children_reparented?` · ${result.children_reparented} sub-code(s) moved up`:''}.`);return;
  }
  if(a==='code-merge'){
    const id=button.dataset.id, target=$('#merge-target').value;
    const result=await api(projectUrl('code-merge'),{source_id:id,target_id:target});
    if(state.codeFilter===id)state.codeFilter=null;
    closeModal();await refresh();
    toast(`Merged “${result.source}” into “${result.target}” · ${result.codings_moved} coding(s) moved${result.duplicates_collapsed?` · ${result.duplicates_collapsed} duplicate(s) collapsed`:''}.`);return;
  }
  if(a==='save-annotation'){await api(projectUrl('annotations'),{...state.selection,code_id:$('#annotation-code').value,memo:$('#annotation-memo').value});state.selection=null;closeModal();await refresh();toast(QT('passageCoded','Passage coded.'));return;}
  if(a==='review'){const start=state.project.suggestions.find(s=>s.id===button.dataset.id)?.start;await api(projectUrl('review'),{id:button.dataset.id,action:button.dataset.decision});await refresh();locate(start);toast(button.dataset.decision==='accept'?QT('toastAccepted','Accepted and added to your codings.'):QT('toastRejected','Rejected; review decision saved.'));return;}
  if(a==='annotation'){
    const annotation=state.project.annotations.find(x=>x.id===button.dataset.id);
    modal(codesFor(annotation).name,`<blockquote class="big-quote">${esc(annotation.quote)}</blockquote><p>Source range [${annotation.start}, ${annotation.end}) · ${esc(annotation.source)}</p><label class="field">${QT('researchMemo','Research memo')}<textarea id="edit-memo" rows="4">${esc(annotation.memo)}</textarea></label>`,`<button class="danger" data-action="remove-annotation"${demoLock()} data-id="${annotation.id}">${QT('removeCoding','Remove coding')}</button><button class="primary" data-action="save-memo"${demoLock()} data-id="${annotation.id}">${QT('saveMemo','Save memo')}</button>`);return;
  }
  if(a==='save-memo'){await api(projectUrl('memo'),{id:button.dataset.id,memo:$('#edit-memo').value});closeModal();await refresh();toast(QT('memoSaved','Memo saved.'));return;}
  if(a==='remove-annotation'){await api(projectUrl('remove-annotation'),{id:button.dataset.id});closeModal();await refresh();toast(QT('codingRemoved','Coding removed; the previous record is retained in the audit trail.'));return;}
  if(a==='save-settings'||a==='clear-key'){
    state.config=await api('/api/config',{base_url:$('#api-base').value,model:$('#api-model').value,api_key:a==='clear-key'?'':$('#api-key').value,keep_key:a!=='clear-key'});closeModal();toast(a==='clear-key'?QT('keyCleared','Key cleared from memory.'):QT('settingsSaved','Settings saved. No text has been sent.'));return;
  }
  if(a==='start-analysis'){
    if(!$('#send-confirm').checked)throw new Error(QT('confirmFirst','Confirm the request content first.'));
    const job=await api('/api/analyze',{preview_id:activePreview.id,confirmed:true});state.jobs.push(job);closeModal();renderJob();startPolling();toast(QT('analysisStarted','Analysis started. Results will appear as suggestions.'));return;
  }
  if(a==='cancel-job'){await api(`/api/jobs/${button.dataset.id}/cancel`,{});toast(QT('cancelRequested','Cancellation requested. The current request may still finish.'));return;}
  if(a==='switch-project'){const id=$('#modal-project-select').value;closeModal();await loadProject(id);return;}
  if(a==='new-project')return createProject({name:$('#new-project-name').value,kind:'empty'});
  if(a==='demo-project')return createProject({kind:'demo'});
  if(a==='grounded-project')return createProject({kind:'grounded_examples'});
  if(a==='benchmark-project')return createProject({kind:'benchmark'});
  if(a==='reference-project')return createProject({kind:'reference'});
  if(a==='restore-pick'){$('#restore-file').click();return;}
  if(a==='plot-export'){
    const response=await fetch(projectUrl('plot-bundle')+'?'+plotQuery(),{headers:{'X-QualiCraft-Token':state.token}});
    if(!response.ok){
      const problem=await response.json().catch(()=>({error:'The figure could not be produced.'}));
      throw new Error(problem.error||'The figure could not be produced.');
    }
    const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');
    link.href=url;link.download='qualicraft-figure.zip';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast(QT('figureExported','Figure, counts and script exported.'));
    return;
  }
  if(a==='download'){
    const format=button.dataset.format,response=await fetch(projectUrl('export')+'?format='+format,{headers:{'X-QualiCraft-Token':state.token}});
    if(!response.ok)throw new Error('Export failed.');const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');link.href=url;link.download='qualicraft-'+(format==='json'?'project.json':format==='methods'?'methods.md':format+'.csv');link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(QT('exported','Exported to your browser download folder.'));return;
  }
}
function renderJob(){
  const holder=$('#job-status');if(!holder)return;
  const job=state.jobs.filter(j=>j.project_id===state.project.id).at(-1);
  if(!job){holder.innerHTML='';return;}
  const labels={running:job.cancel_requested?QT('jobStopping','Stopping'):QT('jobRunning','Analyzing'),completed:QT('jobComplete','Analysis complete'),cancelled:QT('jobCancelled','Analysis canceled'),failed:QT('jobFailed','Analysis interrupted')};
  holder.innerHTML=`<div class="job-bar"><span>${esc(labels[job.status])} · ${job.done}/${job.total} segments · ${job.saved} new suggestions${job.discarded?' · '+job.discarded+' failed validation':''}${job.error?' · '+esc(job.error):''}</span>${job.status==='running'?`<button data-action="cancel-job" data-id="${job.id}" ${job.cancel_requested?'disabled':''}>${QT('stopRemaining','Stop remaining requests')}</button>`:''}</div>`;
}
function startPolling(){
  clearTimeout(pollTimer);pollTimer=setTimeout(async()=>{try{const before=state.jobs.filter(j=>j.status==='running').map(j=>j.id);state.jobs=await api('/api/jobs');renderJob();const finished=state.jobs.find(j=>before.includes(j.id)&&j.status!=='running');if(finished){if(finished.project_id===state.project.id)await refresh();toast(finished.error||'Analysis finished. Review your suggestions.',finished.status==='failed');}if(state.jobs.some(j=>j.status==='running'))startPolling();}catch(e){toast('Could not read task status. Refresh to view saved results.',true);}},1500);
}
document.addEventListener('click',async e=>{const button=e.target.closest('[data-action]');if(!button||button.disabled)return;button.disabled=true;try{await action(button);}catch(error){errorDisplay(error);}finally{if(button.isConnected)button.disabled=button.dataset.action==='start-analysis'&&!$('#send-confirm')?.checked;}});
document.addEventListener('click',e=>{
  const brick=e.target.closest('.brick'); if(!brick) return;
  const on=brick.classList.toggle('on');
  brick.setAttribute('aria-pressed',String(on));
  const state_=brick.querySelector('.brick-state'); if(state_) state_.textContent=on?QT('added','Added'):QT('add','Add');
});
document.addEventListener('change',async e=>{
  if(e.target.dataset&&e.target.dataset.plot){state.plotOptions[e.target.dataset.plot]=e.target.value;render();return;}

  try{
    if(e.target.id==='project-select')await loadProject(e.target.value);
    if(e.target.id==='review-filter'){state.reviewFilter=e.target.value;render();}
    if(e.target.id==='send-confirm')$('[data-action="start-analysis"]').disabled=!e.target.checked;
    if(e.target.matches('input[type="file"]')&&e.target.files[0]){const label=document.querySelector('[data-file-name="'+e.target.id+'"]');if(label)label.textContent=e.target.files[0].name;if(e.target.id==='import-file')$('#document-name').value=e.target.files[0].name.replace(/\.(txt|docx)$/i,'');}
    if(e.target.id==='restore-file'&&e.target.files[0]){if(e.target.files[0].size>20_000_000)throw new Error('Project file exceeds 20 MB.');await createProject({kind:'restore',project:JSON.parse(await e.target.files[0].text())});}
  }catch(error){errorDisplay(error);}
});
document.addEventListener('input',e=>{if(e.target.id==='search'){state.search=e.target.value;state.selection=null;closeCodePopup();$('#reader').innerHTML=readerHtml();}else if(e.target.id==='side-filter'){state.sideFilter=e.target.value;refreshSideList();}});
let docMemoTimer=null;
document.addEventListener('input',e=>{
  if(e.target.id!=='doc-memo')return;
  const doc=state.project.documents.find(d=>d.id===state.docId);
  if(doc)doc.memo=e.target.value;
  const badge=$('#doc-memo-state');
  if(badge)badge.textContent='\u2026';
  clearTimeout(docMemoTimer);
  docMemoTimer=setTimeout(async()=>{
    const target=$('#doc-memo-state');
    try{
      await api(projectUrl('document-update'),{id:state.docId,changes:{memo:e.target.value}});
      if(target){target.textContent='saved';setTimeout(()=>{if(target.isConnected)target.textContent='';},1600);}
    }catch(error){
      if(target)target.textContent='not saved';
    }
  },900);
});
document.addEventListener('mouseup',e=>{if(e.target.closest('#reader'))selectionUpdate();});
document.addEventListener('keyup',e=>{if(e.shiftKey&&e.target.closest('#reader'))selectionUpdate();});
document.addEventListener('mousedown',e=>{if(!e.target.closest('#code-popup')&&!e.target.closest('#reader')&&!e.target.closest('dialog'))closeCodePopup();});
window.addEventListener('scroll',()=>positionCodePopup(),true);
window.addEventListener('resize',()=>positionCodePopup());
async function init(){try{const boot=await api('/api/bootstrap');state.token=boot.token;state.projects=boot.projects;state.config=boot.config;await loadProject(state.projects[0].id);state.jobs=await api('/api/jobs');renderJob();if(state.jobs.some(j=>j.status==='running'))startPolling();}catch(error){$('#app').innerHTML=`<div class="loading">Could not open workspace: ${esc(error.message)}. Check that the local server is running, then refresh.</div>`;}}
init();

/* ---------------------------------------------------------------- network --
   A force-directed map of the codebook: themes, the codes inside them, and
   the coded passages underneath. It answers two questions a table cannot —
   which theme carries the study (node size), and which codes keep turning up
   together (the dashed edges, which the codebook itself does not record).

   Passages stay hidden until a code is opened. Several hundred passage nodes
   on screen at once is noise, not information, so they are revealed one code
   at a time and capped. */
const NET = {
  nodes: [], links: [], index: new Map(),
  visible: new Set(), expanded: new Set(), selected: null,
  drag: null, frame: 0, alpha: 0, svg: null, cap: 14,
};

/* A fixed logical canvas, scaled to fit by preserveAspectRatio. Reading the
   rendered size to build the viewBox is circular — the content widens the
   element, the wider element widens the next viewBox — and it ran away to
   23,000px before anyone noticed. */
const NET_VIEW = { w: 1000, h: 560 };
const NET_RADIUS = { theme: 26, code: 13, passage: 4.5 };
const NET_FILL = { theme: '#33465c', code: '#5b7ba6', passage: '#c8cfd8' };

async function loadNetwork() {
  const stage = document.getElementById('network-stage');
  if (!stage) return;
  if (NET.frame) cancelAnimationFrame(NET.frame);
  NET.frame = 0;
  try {
    // projectUrl adds the slash itself; passing '/network' yields '//network'.
    const graph = await api(projectUrl('network'));
    NET.nodes = graph.nodes.map((n) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }));
    NET.links = graph.links;
    NET.index = new Map(NET.nodes.map((n) => [n.id, n]));
    NET.visible = new Set(graph.nodes.filter((n) => n.kind !== 'passage').map((n) => n.id));
    NET.expanded = new Set();
    NET.selected = null;
    NET.levels = graph.levels;
    seedNetwork();
    stage.innerHTML = '<svg id="network-svg" role="img"></svg>';
    NET.svg = document.getElementById('network-svg');
    drawNetwork();
    drawNetworkLegend();
    wakeNetwork();
  } catch (error) {
    stage.innerHTML = '<div class="network-empty">' + esc(error.message) + '</div>';
  }
}

/* Themes sit on a ring, their codes around them. A deterministic start means
   the same project lays out the same way twice, which matters when a
   researcher comes back to it. */
function seedNetwork() {
  const themes = NET.nodes.filter((n) => n.kind === 'theme');
  themes.forEach((theme, i) => {
    const angle = (i / Math.max(1, themes.length)) * Math.PI * 2 - Math.PI / 2;
    theme.x = Math.cos(angle) * 370;
    theme.y = Math.sin(angle) * 200;
  });
  const scatter = (parent, spread) => {
    const a = (parent && parent.x) || 0;
    const b = (parent && parent.y) || 0;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * spread;
    return [a + Math.cos(angle) * radius, b + Math.sin(angle) * radius];
  };
  NET.nodes.filter((n) => n.kind === 'code').forEach((code) => {
    const [x, y] = scatter(NET.index.get('theme:' + code.theme), 120);
    code.x = x; code.y = y;
  });
  NET.nodes.filter((n) => n.kind === 'passage').forEach((p) => {
    const [x, y] = scatter(NET.index.get('code:' + p.code), 70);
    p.x = x; p.y = y;
  });
}

function visibleNetwork() {
  const nodes = NET.nodes.filter((n) => NET.visible.has(n.id));
  const ids = new Set(nodes.map((n) => n.id));
  const links = NET.links.filter((l) => ids.has(l.source) && ids.has(l.target));
  return { nodes, links, ids };
}

function stepNetwork() {
  const { nodes, links } = visibleNetwork();
  const n = nodes.length;
  for (let i = 0; i < n; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < n; j++) {
      const b = nodes[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d2 = dx * dx + dy * dy || 0.01;
      const d = Math.sqrt(d2);
      const force = 2400 / d2;
      const fx = (dx / d) * force, fy = (dy / d) * force;
      a.vx -= fx; a.vy -= fy;
      b.vx += fx; b.vy += fy;
    }
  }
  links.forEach((l) => {
    const a = NET.index.get(l.source), b = NET.index.get(l.target);
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
    const rest = l.kind === 'cooccurrence' ? 230 : l.kind === 'hierarchy' ? 105 : 52;
    const k = l.kind === 'cooccurrence' ? 0.006 : l.kind === 'hierarchy' ? 0.028 : 0.05;
    const f = (d - rest) * k;
    const fx = (dx / d) * f, fy = (dy / d) * f;
    a.vx += fx; a.vy += fy;
    b.vx -= fx; b.vy -= fy;
  });
  // Repulsion has no natural bound, so without a fence the outermost nodes
  // drift off the canvas and the figure silently loses its edges.
  const limitX = NET_VIEW.w / 2 - 34;
  const limitY = NET_VIEW.h / 2 - 30;
  nodes.forEach((node) => {
    if (NET.drag === node) { node.vx = 0; node.vy = 0; return; }
    node.vx -= node.x * 0.0035;
    node.vy -= node.y * 0.0035;
    node.vx *= 0.85; node.vy *= 0.85;
    node.x += node.vx * NET.alpha;
    node.y += node.vy * NET.alpha;
    node.x = Math.max(-limitX, Math.min(limitX, node.x));
    node.y = Math.max(-limitY, Math.min(limitY, node.y));
  });
  NET.alpha *= 0.982;
}

function wakeNetwork() {
  NET.alpha = 1;
  if (!NET.frame) NET.frame = requestAnimationFrame(tickNetwork);
}

function tickNetwork() {
  NET.frame = 0;
  if (NET.alpha < 0.02) { drawNetwork(); return; }
  stepNetwork();
  drawNetwork();
  NET.frame = requestAnimationFrame(tickNetwork);
}

/* Everything within one hop of the selection stays lit; the rest fades. This
   is the whole point of the view — seeing what belongs with what. */
function networkFocus() {
  if (!NET.selected) return null;
  const keep = new Set([NET.selected]);
  NET.links.forEach((l) => {
    if (l.source === NET.selected) keep.add(l.target);
    if (l.target === NET.selected) keep.add(l.source);
  });
  return keep;
}

function drawNetwork() {
  if (!NET.svg) return;
  const { nodes, links } = visibleNetwork();
  const focus = networkFocus();
  const cx = NET_VIEW.w / 2, cy = NET_VIEW.h / 2;
  NET.svg.setAttribute('viewBox', '0 0 ' + NET_VIEW.w + ' ' + NET_VIEW.h);
  NET.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const parts = [];
  links.forEach((l) => {
    const a = NET.index.get(l.source), b = NET.index.get(l.target);
    if (!a || !b) return;
    const lit = !focus || (focus.has(l.source) && focus.has(l.target));
    const dashed = l.kind === 'cooccurrence';
    const width = dashed ? Math.min(3.2, 0.7 + l.weight * 0.28) : l.kind === 'coding' ? 0.6 : 1.1;
    parts.push('<line x1="' + (a.x + cx).toFixed(1) + '" y1="' + (a.y + cy).toFixed(1)
      + '" x2="' + (b.x + cx).toFixed(1) + '" y2="' + (b.y + cy).toFixed(1)
      + '" stroke="' + (dashed ? '#b8763f' : '#4b607c')
      + '" stroke-width="' + width + '"'
      + (dashed ? ' stroke-dasharray="4 3"' : '')
      + ' opacity="' + (lit ? (dashed ? 0.55 : 0.35) : 0.06) + '"/>');
  });
  // Labelling all 259 codes buries the structure under its own text. Themes
  // are always named, the busiest codes are named, and selecting a node names
  // its neighbours — which is when a reader actually wants the words.
  const busiest = nodes.filter((n) => n.kind === 'code')
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 16)
    .map((n) => n.id);
  const named = new Set(busiest);
  nodes.filter((n) => n.kind === 'theme').forEach((n) => named.add(n.id));

  // Selecting a theme lights its whole family, and naming all of them puts the
  // labels back on top of each other — the thing that made the unselected view
  // unreadable. The busiest neighbours get names; the rest stay as dots.
  const NEIGHBOUR_NAMES = 12;
  const focusNamed = focus
    ? new Set(nodes.filter((n) => focus.has(n.id) && n.kind === 'code')
        .sort((a, b) => b.weight - a.weight)
        .slice(0, NEIGHBOUR_NAMES)
        .map((n) => n.id))
    : null;

  nodes.forEach((node) => {
    const lit = !focus || focus.has(node.id);
    const r = NET_RADIUS[node.kind] * (node.kind === 'theme' ? Math.min(1.7, 0.85 + node.weight / 260)
      : node.kind === 'code' ? Math.min(1.5, 0.8 + node.weight / 90) : 1);
    parts.push('<circle class="net-node" data-id="' + esc(node.id) + '" cx="' + (node.x + cx).toFixed(1)
      + '" cy="' + (node.y + cy).toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + NET_FILL[node.kind]
      + '" opacity="' + (lit ? (node.kind === 'passage' ? 0.75 : 0.95) : 0.08) + '"/>');
    const wanted = node.kind === 'theme'
      || (focus ? (lit && focusNamed.has(node.id)) : named.has(node.id));
    if (node.kind !== 'passage' && wanted) {
      // A white halo keeps a label readable where it crosses an edge.
      parts.push('<text x="' + (node.x + cx).toFixed(1) + '" y="' + (node.y + cy + r + 12).toFixed(1)
        + '" text-anchor="middle" font-size="' + (node.kind === 'theme' ? 12.5 : 10.5)
        + '" fill="#2b3648" stroke="#fdfcfb" stroke-width="3" paint-order="stroke" stroke-linejoin="round" opacity="'
        + (lit ? 0.95 : 0.1) + '">' + esc(node.label.length > 30 ? node.label.slice(0, 29) + '…' : node.label) + '</text>');
    }
  });
  NET.svg.innerHTML = parts.join('');
}

function drawNetworkLegend() {
  const el = document.getElementById('network-legend');
  if (!el || !NET.levels) return;
  el.innerHTML = '<span><i class="net-dot net-dot--theme"></i>' + QT('themes', 'Themes') + ' ' + NET.levels.themes + '</span>'
    + '<span><i class="net-dot net-dot--code"></i>' + QT('codes', 'Codes') + ' ' + NET.levels.codes + '</span>'
    + '<span><i class="net-dot net-dot--passage"></i>' + QT('passages', 'Passages') + ' ' + NET.levels.passages + '</span>'
    + '<span><i class="net-line"></i>' + QT('netOverlap', 'codes overlapping in one interview') + '</span>'
    + (NET.selected ? '<button type="button" class="link" data-action="net-clear">' + QT('netClear', 'Clear selection') + '</button>' : '');
}

/* Opening a code reveals its passages, capped: past a dozen or so the extra
   nodes stop adding information and start costing legibility. */
function toggleNetworkNode(id) {
  const node = NET.index.get(id);
  if (!node) return;
  if (NET.selected === id) { NET.selected = null; NET.expanded.clear(); }
  else {
    NET.selected = id;
    if (node.kind === 'code') {
      const children = NET.links
        .filter((l) => l.kind === 'coding' && l.source === id)
        .slice(0, NET.cap);
      children.forEach((l) => NET.visible.add(l.target));
      if (children.length) NET.expanded.add(id);
    }
    if (node.kind === 'theme') {
      NET.links.filter((l) => l.kind === 'hierarchy' && l.source === id)
        .forEach((l) => NET.visible.add(l.target));
    }
  }
  drawNetwork();
  drawNetworkLegend();
  wakeNetwork();
}

function clearNetworkSelection() {
  NET.selected = null;
  NET.expanded.clear();
  NET.visible = new Set(NET.nodes.filter((n) => n.kind !== 'passage').map((n) => n.id));
  drawNetwork();
  drawNetworkLegend();
  wakeNetwork();
}

document.addEventListener('click', (e) => {
  const circle = e.target.closest && e.target.closest('.net-node');
  if (circle) { toggleNetworkNode(circle.dataset.id); return; }
  const clear = e.target.closest && e.target.closest('[data-action="net-clear"]');
  if (clear) { clearNetworkSelection(); }
});

(function bindNetworkDrag() {
  // Screen pixels -> logical canvas, undoing the preserveAspectRatio scaling
  // and the letterboxing on whichever axis is shorter.
  const locate = (event) => {
    if (!NET.svg) return null;
    const box = NET.svg.getBoundingClientRect();
    const scale = Math.min(box.width / NET_VIEW.w, box.height / NET_VIEW.h) || 1;
    const padX = (box.width - NET_VIEW.w * scale) / 2;
    const padY = (box.height - NET_VIEW.h * scale) / 2;
    return {
      x: (event.clientX - box.left - padX) / scale - NET_VIEW.w / 2,
      y: (event.clientY - box.top - padY) / scale - NET_VIEW.h / 2,
    };
  };
  document.addEventListener('mousedown', (e) => {
    const circle = e.target.closest && e.target.closest('.net-node');
    if (!circle) return;
    const node = NET.index.get(circle.dataset.id);
    if (!node) return;
    NET.drag = node;
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!NET.drag) return;
    const at = locate(e);
    if (!at) return;
    NET.drag.x = at.x; NET.drag.y = at.y;
    NET.drag.vx = 0; NET.drag.vy = 0;
    NET.alpha = Math.max(NET.alpha, 0.35);
    if (!NET.frame) NET.frame = requestAnimationFrame(tickNetwork);
  });
  document.addEventListener('mouseup', () => { NET.drag = null; });
})();

window.addEventListener('resize', () => { if (NET.svg) drawNetwork(); });
