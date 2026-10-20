/* English unless the researcher asks otherwise. Following the browser locale
   silently put the whole interface in Chinese for anyone whose system is set
   to it, which is wrong for a tool shown to a supervisor or shared as a
   screenshot — the reader did not choose that. */
const QT_LANG=(()=>{const u=new URLSearchParams(location.search).get('lang');if(u){try{sessionStorage.setItem('qt_lang',u);}catch(e){}return u;}try{const s=sessionStorage.getItem('qt_lang');if(s)return s;}catch(e){}return 'en';})();
const _T={"en":{"loading":"Opening your local research workspace…","project":"PROJECT","switchProject":"Switch project","newProject":"+ New / import project","navCoding":"Coding workspace","navInsights":"Insights","navPlotting":"Figures","navAudit":"Audit trail","documents":"DOCUMENTS","codebook":"CODEBOOK","tools":"TOOLS","capabilityBlocks":"Capability blocks","localWorkspace":"Local workspace","noFileSelected":"No file selected","publicDemo":"Public demo","publicDemoNote":"Read-only sample project. Changes and uploads are disabled here; run QualiCraft locally to code your own material.","publicDemoReadOnly":"This public demonstration is read-only. Start a local copy to create or change projects.","publicDemoLocked":"Read-only demo. Run QualiCraft locally to make changes.","filterSidebar":"Filter documents and codes","noDocsFilter":"No documents match.","codeHits":"Codes matching","cloudNote":"Cloud only when requested","savedLocally":"Saved locally","model":"Model","export":"Export","switchLanguage":"Switch language","docCount":"documents","codeCount":"codes","codingCount":"codings","reviewCount":"to review","importInterview":"Import interview","mobileSwitch":"Switch / create project","footerBrand":"QUALICRAFT 0.1 · LOCAL WORKSPACE","footerTagline":"Exact source ranges · Researcher-reviewed coding","noDocEyebrow":"A SPACE FOR YOUR QUESTIONS","noDocTitle":"Start with a conversation","noDocBody":"Import TXT, DOCX, or paste a transcript.<br>Build a codebook, code by hand, or connect a model for suggestions.","noDocCreateCode":"Create code","searchDoc":"Search in document","documentLabel":"DOCUMENT","selectHint":"Select text to code a passage","newCode":"+ New code","analyzeAi":"Analyse with AI","readingNotes":"READING NOTES","readingPlaceholder":"First impressions, questions to follow up, anything that stands out.","aiReview":"AI REVIEW","suggestions":"Suggestions","reviewSubtitle":"Verify each interpretation against the source. A suggestion becomes a coding only after you accept it.","pending":"Pending review","reviewAccepted":"Accepted","reviewRejected":"Rejected","reviewFootnote":"Source ranges are verified automatically.<br>Interpretation remains your decision.","noCodes":"No codes yet. Add one to start coding.","noCodesFilter":"No codes to show.","noPassages":"No passages match your filters.","clearFilters":"Clear filters","human":"HUMAN","reference":"REFERENCE","aiReviewed":"AI · REVIEWED","demoSuggest":"DEMO SUGGESTION","aiSuggest":"AI SUGGESTION","locateQuote":"Locate this quotation in the source","rationale":"RATIONALE","acceptCoding":"Accept coding","reject":"Reject","acceptedState":"Accepted by researcher","rejectedState":"Rejected · decision recorded","noSuggestions":"No suggestions in this view","runAiOrChoose":"Run AI coding or choose another review status.","codeFreq":"Code frequency","network":"Relationship map","netLoading":"Building the map…","networkDesc":"Themes are the largest nodes, codes next, coded passages smallest. A dashed edge means two codes were applied to overlapping ranges in the same interview. That is descriptive — it is not correlation, and it is not a claim about a relationship. Click a theme to isolate its family, click a code to open its passages.","netOverlap":"codes overlapping in one interview","netClear":"Clear selection","freqDesc":"Each confirmed quotation–code link counts once. Frequency is not importance or a count of participants. Pending suggestions are excluded. Charts of these counts are drawn in the Figures view, each captioned with the unit it counts.","docCodeMatrix":"Document × code","matrixDesc":"Export the complete matrix as CSV for further analysis and plotting.","applyCodesHint":"Apply codes to see your research take shape.","figures":"Figures","plotDesc":"The figure is drawn by a script on the server, not in the browser, so the preview you see is exactly what the exported script produces.","plotNotInstalled":"The plotting workbench is not installed","plotInstallHint":"Figures are drawn by a Python script rather than in the browser, so the same script can be exported and re-run by a co-author. Install it and reopen this view:","plotNotEnough":"Not enough codings yet","plotNeedTwo":"A figure needs at least two coded passages before there is anything to plot.","plotExportBtn":"Download figure + script","plotExportNote":"A folder with the counts as CSV, the script, and the figure as SVG, PDF and 300 dpi PNG.","auditTitle":"Provenance and activity","auditActions":"actions","codebookShow":"show codes","codebookHide":"hide codes","enableAllBlocks":"Enable figure workflow","enableAllBlocksHint":"Adds theme grouping, Insights, Figures and Audit to this project. Other blocks keep their current settings.","blocksEnabled":"Figure workflow enabled for this project.","plotNoPairs":"No overlapping code ranges","plotNoPairsHint":"This figure counts codes that were applied to overlapping character ranges in the same interview. Two codes on separate passages are never a pair, so the figure stays empty however many codings the project has. Apply two codes to the same stretch of text, or choose a different figure type.","plotCouldNotDraw":"Could not draw the figure","charsLabel":" characters","spansParagraphs":" (spans paragraphs)","subLevel":"sub-level","codeSearchPh":"Type a keyword, press Enter to code","closeEsc":"Close (Esc)","moreOptions":"More options…","analyzeSel":"Analyse with AI","createCodeTpl":"＋ Create “%s” and code it","noCodesYet":"No codes yet — type a keyword to create one","toastCoded":"Coded.","toastCodeCreated":"Created “%s” and coded it.","toastNeedKeyword":"Type a keyword first, or pick a code from the list.","snapshots":"snapshots","backupFailed":"Backup failed","snapshotsTitle":"Snapshots","snapshotsIntro":"A restorable copy is written after every change. Restoring one creates a new project and leaves this one untouched.","restoreCopy":"Restore as a copy","noSnapshots":"No snapshots yet.","backupHint":"A restorable copy is written after every change. Restore it from the Projects dialog.","auditDesc1":"Personal research project. When sharing your findings, document the data source, methods, and role of AI assistance.","auditDesc2":"Activity is saved locally and included in project exports. This is an editable research trail, not a tamper-proof log.","figKind":"Figure type","kindFrequency":"Code frequency","kindCoverage":"Code × interview","kindCooccurrence":"Co-occurrence heatmap","kindHierarchy":"Theme hierarchy","kindAccumulation":"Code accumulation","withinOverlap":"Overlapping text","withinPassage":"The same passage","topN":"Top N codes","groupBy":"Group by","countWithin":"Count within","palette":"Palette","optional":"Optional","clustering":"Clustering","linkage":"Linkage","showCounts":"Show counts","baseFontSize":"Base font size","titleOpt":"Title","on":"On","off":"Off","yes":"Yes","no":"No","pt":"pt","themes":"Themes","codes":"Codes","passages":"Passages","importDlg":"Import interview","importDesc":"Import UTF-8 TXT or DOCX, or paste a transcript. Original line breaks define segments. Use Doctor:/Patient:, Interviewer:/Participant:, or IQ.../IP1: speaker labels. Chinese labels are also supported.","chooseFile":"Choose a file","fileHint":"DOCX imports paragraph and table text; layout, comments, and headers are not retained.","docName":"Document name","docNamePlaceholder":"e.g. P02 · Care experience","pasteTranscript":"Or paste a transcript","pastePlaceholder":"Doctor: How did the conversation feel?\\nPatient: ...","importBtn":"Import locally","importOther":"Import a coding table","importOtherLink":"Already have a coding table from another tool?","importOtherDesc":"Already coded elsewhere? Drop the export here and QualiCraft will read it into a new project — transcripts, codebook and codings, with the source licence recorded.","importOtherFormats":"OpenQDA or NVivo CSV · QualCoder .zip · ATLAS.ti or FAIRqual .xlsx","importOtherName":"Project name (optional)","importOtherNamePh":"Defaults to the file name","importOtherBtn":"Import coding table","importNoFile":"Choose a file first.","importWorking":"Reading the file…","importDone":"Imported","cancel":"Cancel","toolsDlg":"Capability blocks","toolsDesc":"The core is always there: <strong>documents, codes and codings</strong>. Everything else is a block — click one to add it to this project and the interface grows to match. Click again to take it away. Which blocks a study used is stored with the project, so it becomes part of the record.","saveBlocks":"Save blocks","createCode":"Create code","codeName":"Name","codeNamePlaceholder":"e.g. Information barriers","codeDef":"Definition and inclusion criteria","codeDefPlaceholder":"Describe when to use this code and when to exclude it.","groupUnder":"Group under (optional)","topLevel":"— top level —","groupHint":"Choosing a parent makes this a sub-code. Grouping codes under a theme is what turns a flat tag list into a codebook.","color":"Color","saveCode":"Save code","editCode":"Edit code","status":"Status","emergent":"Emergent","provisional":"Provisional","final":"Final","codeMemo":"Code / theme memo","codeMemoPlaceholder":"How is this code or theme developing?","inclusion":"Inclusion criteria","inclusionPlaceholder":"Use this code when…","exclusion":"Exclusion criteria","exclusionPlaceholder":"Do not use it when…","anchorExamples":"Anchor examples (one per line)","anchorPlaceholder":"Typical quotations that illustrate this code.","saveChanges":"Save changes","delete":"Delete","mergeInto":"Merge into…","deleteCode":"Delete code","mergeCode":"Merge code","codePassage":"Code this passage","selectCode":"Select a code","researchMemo":"Research memo","removeCoding":"Remove coding","saveMemo":"Save memo","memoPlaceholder":"Record your interpretation or a question for comparison.","applyCode":"Apply code","settingsTitle":"Cloud model settings","settingsDesc":"The launcher can read a local API_key.txt. Keys entered here stay in server memory only, outside browser storage, projects, and exports.","apiBase":"API Base URL","apiBaseHint":"Alibaba Cloud Beijing: https://dashscope.aliyuncs.com/compatible-mode/v1. A workspace-specific URL in the same region or another compatible endpoint also works.","modelName":"Model name","modelHint":"Default: qwen3.8-flash. When switching providers, update the endpoint, model, and key together.","apiKey":"API Key","apiKeyConfigured":"Configured; leave blank to keep the key for this endpoint","apiKeyPlaceholder":"Enter your key here, not in chat","settingsNotice":"Manual coding is free and works offline. Cloud analysis runs only after confirmation and may incur provider charges. De-identify real transcripts and confirm that sharing them with this provider is permitted.","saveSettings":"Save settings","clearKey":"Clear key","analyzeTitle":"AI-assisted coding","analyzeDesc":"Preview the exact request before running analysis. Results arrive as suggestions for your review.","codingApproach":"Coding approach","deductive":"Deductive · existing codes only","inductive":"Inductive · allow new codes","analysisScope":"Analysis scope","scopePatient":"Labeled patient / participant turns","scopeAll":"All non-empty text segments","includeContext":"Include the preceding doctor or interviewer question as context when speaker labels are recognized.","analyzeNotice":"Up to 200 requests per run. Long segments are split at 6,000 characters. Speaker identification relies on explicit labels. Check the preview before sending.","previewRequests":"Preview requests","reviewRequest":"Review cloud request","modelPrefix":"Model: ","requestsCount":" requests · ","targetChars":" target characters","previewNotice":"Requests include the listed text, selected context, complete codebook definitions, and system instructions. Canceling stops subsequent requests; in-flight requests may still incur charges.","viewFullRequest":"View full request bodies (","noCredentials":" segments, no credentials)","reviewConfirm":"I have reviewed the content. These texts are de-identified and may be shared with this provider.","back":"Back","sendAnalyze":"Send and analyze","projectsTitle":"Research projects","existingProjects":"Existing projects","openProject":"Open project","newProjectName":"New project name","newProjectPlaceholder":"e.g. Experiences of outpatient care","createProject":"Create project","groundedProject":"Tian 2021 · software architecture interviews","groundedDesc":"Import 8 semi-structured practitioner interviews. IP1–IP2 pair Chinese responses with English translations; IP3–IP8 are in English.","demoProject":"Fictional care interview","demoDesc":"Explore a fictional transcript, sample coding, and fixed review suggestions.","benchmarkProject":"TU Delft · blind workspace","benchmarkDesc":"Import 7 transcripts and 54 codes, without reference annotations.","referenceProject":"TU Delft · researcher reference","referenceDesc":"Explore 377 researcher annotations for comparison. These are not model predictions.","restoreProject":"Restore project JSON","restoreDesc":"Restore a backup as a new project while keeping the original.","guideNote":"Guide collections are imported from the local Guide directory and retain source provenance in the project audit trail.","exportTitle":"Export your research","exportDesc":"Files are saved to your browser download folder. Full project exports include source transcripts; handle them as research data.","exportJson":"Full project · JSON","exportJsonDesc":"Transcripts, codebook, codings, suggestions, and activity. Restore later to continue.","exportCsv":"Codings · CSV","exportCsvDesc":"Document, code, source quote, character offsets, memo, and provenance.","exportMatrix":"Document × code · CSV","exportMatrixDesc":"Confirmed codings only, ready for Excel, R, or Python.","exportMethods":"Methods record · Markdown","exportMethodsDesc":"How the analysis was actually carried out, assembled from your audit trail. Draft the methods section from it.","projectCreated":"Project created and saved locally.","blocksUpdated":"Capability blocks updated.","keyCleared":"Key cleared from memory.","settingsSaved":"Settings saved. No text has been sent.","confirmFirst":"Confirm the request content first.","analysisStarted":"Analysis started. Results will appear as suggestions.","cancelRequested":"Cancellation requested. The current request may still finish.","interviewImported":"Interview imported.","codeSaved":"Code saved.","codeUpdated":"Code updated.","passageCoded":"Passage coded.","toastAccepted":"Accepted and added to your codings.","toastRejected":"Rejected; review decision saved.","memoSaved":"Memo saved.","codingRemoved":"Coding removed; the previous record is retained in the audit trail.","figureExported":"Figure, counts and script exported.","exported":"Exported to your browser download folder.","confirmPreview":"Confirm the preview before sending data","jobRunning":"Analyzing","jobStopping":"Stopping","jobComplete":"Analysis complete","jobCancelled":"Analysis canceled","jobFailed":"Analysis interrupted","stopRemaining":"Stop remaining requests","workspaceError":"Could not open workspace: ","workspaceErrorHint":"Check that the local server is running, then refresh.","add":"Add","added":"Added","blocksCount":" services","direct":" direct · ","includingSub":" including sub-codes","subCode":" sub-code(s)","expand":"Expand","collapse":"Collapse","close":"Close","live":"live","inProgress":"in progress","notCovered":"Not covered yet","codingMargin":"CODING MARGIN","charactersLabel":" characters","segmentsLabel":" segments","codingsLabel":" codings"},"zh":{"loading":"正在打开本地研究工作台…","project":"项目","switchProject":"切换项目","newProject":"+ 新建 / 导入项目","navCoding":"编码工作区","navInsights":"洞察","navPlotting":"图表","navAudit":"审计记录","documents":"文档","codebook":"编码本","tools":"工具","capabilityBlocks":"功能模块","localWorkspace":"本地工作区","noFileSelected":"未选择文件","publicDemo":"公开演示","publicDemoNote":"只读示例项目。此处已关闭修改与上传；请在本机运行 QualiCraft 来编码你自己的材料。","publicDemoReadOnly":"这是只读公开演示。请启动本地副本来创建或修改项目。","publicDemoLocked":"只读演示。请在本机运行 QualiCraft 进行修改。","filterSidebar":"筛选文档与编码","noDocsFilter":"没有匹配的文档。","codeHits":"匹配的编码","cloudNote":"仅在请求时连接云端","savedLocally":"已本地保存","model":"模型","export":"导出","switchLanguage":"切换语言","docCount":"份文档","codeCount":"个编码","codingCount":"条标注","reviewCount":"待审核","importInterview":"导入访谈","mobileSwitch":"切换 / 创建项目","footerBrand":"QUALICRAFT 0.1 · 本地工作区","footerTagline":"精确源码范围 · 研究者审核编码","noDocEyebrow":"为您的研究问题留出空间","noDocTitle":"从一段对话开始","noDocBody":"导入 TXT、DOCX 或粘贴访谈稿。<br>建立编码本，手动编码，或连接模型获取建议。","noDocCreateCode":"创建编码","searchDoc":"在文档中搜索","documentLabel":"文档","selectHint":"选中文字即可为段落编码","newCode":"+ 新建编码","analyzeAi":"AI 分析","readingNotes":"阅读笔记","readingPlaceholder":"第一印象、待跟进的问题、任何引起注意的内容。","aiReview":"AI 审核","suggestions":"建议","reviewSubtitle":"逐一核对每个解释与原文的匹配度。建议只有经您确认后才会成为正式编码。","pending":"待审核","reviewAccepted":"已采纳","reviewRejected":"已拒绝","reviewFootnote":"源码范围已自动验证。<br>解释由您决定。","noCodes":"尚无编码。添加一个即可开始编码。","noCodesFilter":"没有可显示的编码。","noPassages":"没有匹配的段落。","clearFilters":"清除筛选","human":"人工","reference":"参考","aiReviewed":"AI · 已审核","demoSuggest":"演示建议","aiSuggest":"AI 建议","locateQuote":"在原文中定位此引用","rationale":"理由","acceptCoding":"采纳编码","reject":"拒绝","acceptedState":"已由研究者采纳","rejectedState":"已拒绝 · 决定已记录","noSuggestions":"此视图下没有建议","runAiOrChoose":"运行 AI 编码或选择其他审核状态。","codeFreq":"编码频率","network":"关系网图","netLoading":"正在生成关系图…","networkDesc":"主题是最大的节点，编码次之，被编码的文本片段最小。虚线表示两个编码被用在同一份访谈里区间重叠的地方。这是描述性的——不代表相关，也不构成关系判断。点击主题可只看它这一支，点击编码可展开它的文本片段。","netOverlap":"在同一份访谈中重叠的编码","netClear":"清除选择","freqDesc":"每条已确认的引用—编码链接计为一次。频率不代表重要性，也不代表受访者数量。待审核建议不计入。需要按编码计数出图，请到「图表」页；每张图都写明它数的是什么。","docCodeMatrix":"文档 × 编码","matrixDesc":"导出完整矩阵为 CSV，以便进一步分析和绘图。","applyCodesHint":"应用编码，让您的研究逐渐成形。","figures":"图表","plotDesc":"图表由服务器端脚本绘制，而非浏览器，因此您看到的预览与导出的脚本结果完全一致。","plotNotInstalled":"绘图工作台未安装","plotInstallHint":"图表由 Python 脚本绘制而非浏览器，因此同一脚本可被导出并由合作者重新运行。安装后重新打开此视图：","plotNotEnough":"编码数量不足","plotNeedTwo":"绘图需要至少两条已编码段落。","plotExportBtn":"下载图表 + 脚本","plotExportNote":"包含计数 CSV、脚本以及 SVG、PDF 和 300 dpi PNG 格式的图表。","auditTitle":"来源与活动","auditActions":"条操作","codebookShow":"展开","codebookHide":"收起","enableAllBlocks":"启用绘图工作流","enableAllBlocksHint":"为本项目启用主题归组、洞察、绘图和审计，其他能力块保持当前设置。","blocksEnabled":"已为本项目启用绘图工作流。","plotNoPairs":"没有区间重叠的编码","plotNoPairsHint":"此图统计的是「同一份访谈中被应用到相互重叠字符区间」的编码对。两个编码如果落在不同段落上，就不构成一对，所以无论编了多少码，这张图都会是空的。请将两个编码应用到同一段文字，或改选其他图型。","plotCouldNotDraw":"无法绘制该图","charsLabel":" 字符","spansParagraphs":"（跨段）","subLevel":"子级","codeSearchPh":"输入关键字，回车即打标","closeEsc":"关闭 (Esc)","moreOptions":"更多选项…","analyzeSel":"AI 分析","createCodeTpl":"＋ 新建编码「%s」并打标","noCodesYet":"还没有编码，输入关键字即可新建","toastCoded":"已打标。","toastCodeCreated":"已新建编码「%s」并打标。","toastNeedKeyword":"先输入关键字，或从列表里选一个编码。","snapshots":"份快照","backupFailed":"备份失败","snapshotsTitle":"快照","snapshotsIntro":"每次改动后都会写一份可恢复的副本。恢复会新建一个项目，当前项目不受影响。","restoreCopy":"恢复为副本","noSnapshots":"还没有快照。","backupHint":"每次改动后都会写一份可恢复的副本。在「项目」对话框里恢复。","auditDesc1":"个人研究项目。分享研究结果时，请记录数据来源、方法和 AI 辅助的角色。","auditDesc2":"活动记录保存在本地，并包含在项目导出中。这是可编辑的研究记录，而非不可篡改的日志。","figKind":"图表类型","kindFrequency":"编码频率","kindCoverage":"编码 × 访谈","kindCooccurrence":"共现热力图","kindHierarchy":"主题层级","kindAccumulation":"编码累积","withinOverlap":"区间重叠","withinPassage":"同一段落","topN":"取前 N 个编码","groupBy":"分组方式","countWithin":"计数范围","palette":"配色","optional":"可选","clustering":"聚类","linkage":"连接方式","showCounts":"显示计数","baseFontSize":"基准字号","titleOpt":"标题","on":"开","off":"关","yes":"是","no":"否","pt":"磅","themes":"主题","codes":"编码","passages":"段落","importDlg":"导入访谈","importDesc":"导入 UTF-8 TXT 或 DOCX，或粘贴访谈稿。原始换行符定义段落。使用 Doctor:/Patient:、Interviewer:/Participant: 或 IQ.../IP1: 等说话人标签。中文标签也受支持。","chooseFile":"选择文件","fileHint":"DOCX 导入段落和表格文本；版式、批注和页眉不会被保留。","docName":"文档名称","docNamePlaceholder":"例如 P02 · 护理体验","pasteTranscript":"或粘贴访谈稿","pastePlaceholder":"医生：对话感觉如何？\\n患者：…","importBtn":"本地导入","importOther":"导入编码表","importOtherLink":"已经有别的工具导出的编码表？","importOtherDesc":"在别处编好码了？把导出文件放进来，QualiCraft 会把它读成一个新项目——转录、编码本和标注一起，并记下来源许可。","importOtherFormats":"OpenQDA 或 NVivo CSV · QualCoder .zip · ATLAS.ti 或 FAIRqual .xlsx","importOtherName":"项目名称（可选）","importOtherNamePh":"默认用文件名","importOtherBtn":"导入编码表","importNoFile":"请先选择一个文件。","importWorking":"正在读取文件…","importDone":"已导入","cancel":"取消","toolsDlg":"功能模块","toolsDesc":"核心功能始终可用：<strong>文档、编码和标注</strong>。其余均为模块——点击即可添加到本项目，界面会随之扩展。再次点击即可移除。研究使用了哪些模块会随项目一起保存，因此成为记录的一部分。","saveBlocks":"保存模块","createCode":"创建编码","codeName":"名称","codeNamePlaceholder":"例如 信息障碍","codeDef":"定义与纳入标准","codeDefPlaceholder":"描述何时使用此编码，何时排除。","groupUnder":"分组归属（可选）","topLevel":"— 顶级 —","groupHint":"选择父级会将此编码设为子编码。将编码归入主题下，才能把平面标签列表变成编码本。","color":"颜色","saveCode":"保存编码","editCode":"编辑编码","status":"状态","emergent":"涌现","provisional":"暂定","final":"最终","codeMemo":"编码 / 主题备忘录","codeMemoPlaceholder":"此编码或主题的发展情况如何？","inclusion":"纳入标准","inclusionPlaceholder":"在以下情况下使用此编码…","exclusion":"排除标准","exclusionPlaceholder":"在以下情况下不要使用…","anchorExamples":"锚点示例（每行一个）","anchorPlaceholder":"能说明此编码的典型引用。","saveChanges":"保存更改","delete":"删除","mergeInto":"合并到…","deleteCode":"删除编码","mergeCode":"合并编码","codePassage":"为段落编码","selectCode":"选择编码","researchMemo":"研究备忘录","removeCoding":"移除编码","saveMemo":"保存备忘录","memoPlaceholder":"记录您的解释或用于比较的问题。","applyCode":"应用编码","settingsTitle":"云端模型设置","settingsDesc":"启动器可以读取本地 API_key.txt。此处输入的密钥仅保存在服务器内存中，不会进入浏览器存储、项目或导出文件。","apiBase":"API 基础地址","apiBaseHint":"阿里云北京：https://dashscope.aliyuncs.com/compatible-mode/v1。同一区域或其他兼容端点的工作区专属地址也可以。","modelName":"模型名称","modelHint":"默认：qwen3.8-flash。切换提供商时，请同时更新端点、模型和密钥。","apiKey":"API 密钥","apiKeyConfigured":"已配置；留空可保留此端点的密钥","apiKeyPlaceholder":"在此输入密钥，不要在对话中发送","settingsNotice":"手动编码免费且可离线工作。云端分析仅在确认后运行，可能产生提供商费用。对真实访谈稿去标识化，并确认允许与提供商共享。","saveSettings":"保存设置","clearKey":"清除密钥","analyzeTitle":"AI 辅助编码","analyzeDesc":"运行分析前先预览具体请求。结果将以建议形式呈现供您审核。","codingApproach":"编码方式","deductive":"演绎 · 仅使用现有编码","inductive":"归纳 · 允许新建编码","analysisScope":"分析范围","scopePatient":"标记为患者 / 参与者的发言","scopeAll":"所有非空文本段落","includeContext":"识别到说话人标签时，将前面的医生或访谈者问题作为上下文包含在内。","analyzeNotice":"每次运行最多 200 条请求。长段落会在 6,000 字符处拆分。说话人识别依赖显式标签。发送前请先检查预览。","previewRequests":"预览请求","reviewRequest":"审核云端请求","modelPrefix":"模型：","requestsCount":" 条请求 · ","targetChars":" 目标字符","previewNotice":"请求包含所列文本、所选上下文、完整编码本定义和系统指令。取消会停止后续请求；进行中的请求可能仍会产生费用。","viewFullRequest":"查看完整请求内容（","noCredentials":" 个段落，不含凭证）","reviewConfirm":"我已审核内容。这些文本已去标识化，可以与此提供商共享。","back":"返回","sendAnalyze":"发送并分析","projectsTitle":"研究项目","existingProjects":"现有项目","openProject":"打开项目","newProjectName":"新项目名称","newProjectPlaceholder":"例如 门诊护理体验","createProject":"创建项目","groundedProject":"Tian 2021 · 软件架构访谈","groundedDesc":"导入 8 份半结构化从业者访谈。IP1–IP2 为中文回答配英文翻译；IP3–IP8 为英文。","demoProject":"虚构护理访谈","demoDesc":"探索一份虚构访谈稿、示例编码和固定的审核建议。","benchmarkProject":"代尔夫特理工 · 盲评工作区","benchmarkDesc":"导入 7 份访谈稿和 54 个编码，不含参考标注。","referenceProject":"代尔夫特理工 · 研究者参考","referenceDesc":"查看 377 条研究者标注以供比较。这些不是模型预测。","restoreProject":"恢复项目 JSON","restoreDesc":"将备份恢复为新项目，同时保留原始项目。","guideNote":"指南集从本地 Guide 目录导入，并在项目审计记录中保留来源出处。","exportTitle":"导出您的研究","exportDesc":"文件将保存到浏览器下载文件夹。完整项目导出包含源访谈稿；请按研究数据处理。","exportJson":"完整项目 · JSON","exportJsonDesc":"访谈稿、编码本、标注、建议和活动记录。后续可恢复继续工作。","exportCsv":"标注 · CSV","exportCsvDesc":"文档、编码、源引用、字符偏移、备忘录和来源。","exportMatrix":"文档 × 编码 · CSV","exportMatrixDesc":"仅包含已确认标注，可直接用于 Excel、R 或 Python。","exportMethods":"方法记录 · Markdown","exportMethodsDesc":"根据您的审计记录汇编实际执行的分析过程。可据此起草方法部分。","projectCreated":"项目已创建并保存在本地。","blocksUpdated":"功能模块已更新。","keyCleared":"密钥已从内存中清除。","settingsSaved":"设置已保存。尚未发送任何文本。","confirmFirst":"请先确认请求内容。","analysisStarted":"分析已开始。结果将以建议形式出现。","cancelRequested":"已请求取消。当前请求可能仍会完成。","interviewImported":"访谈已导入。","codeSaved":"编码已保存。","codeUpdated":"编码已更新。","passageCoded":"段落已编码。","toastAccepted":"已采纳并添加到您的标注中。","toastRejected":"已拒绝；审核决定已保存。","memoSaved":"备忘录已保存。","codingRemoved":"编码已移除；之前的记录保留在审计追踪中。","figureExported":"图表、计数和脚本已导出。","exported":"已导出到浏览器下载文件夹。","confirmPreview":"发送数据前请先确认预览","jobRunning":"分析中","jobStopping":"停止中","jobComplete":"分析完成","jobCancelled":"分析已取消","jobFailed":"分析中断","stopRemaining":"停止剩余请求","workspaceError":"无法打开工作区：","workspaceErrorHint":"请检查本地服务器是否正在运行，然后刷新页面。","add":"添加","added":"已添加","blocksCount":" 个服务","direct":" 直接 · ","includingSub":" 含子编码","subCode":" 个子编码","expand":"展开","collapse":"收起","close":"关闭","live":"在线","inProgress":"进行中","notCovered":"尚未覆盖","codingMargin":"编码边栏","charactersLabel":" 字符","segmentsLabel":" 段落","codingsLabel":" 编码"}};
Object.assign(_T.en, {
  motionSystem:'Motion: system', motionReduced:'Motion: reduced', motionHint:'Reduce movement, or follow system preferences',
  previousNode:'Previous theme or code', nextNode:'Next theme or code',
  showPassages:'Show passage nodes', hidePassages:'Hide passage nodes', codingsLabel:'Codings', rangesLabel:'Source ranges',
  rangeCodings:'saved codings', oneRange:'1 source range', allRangeCodings:'Codings on this source range',
  networkKeys:'Use the selector or Previous / Next to select. Show / Hide changes passage dots only. Escape clears the selection. Each passage dot is one saved coding; several codings may share one source range.',
  noNetworkSelection:'No selection. Choose a theme or code.',
  insightsViews:'Insights views', selectNetwork:'Select a theme or code',
  evidenceTitle:'Source evidence', evidenceHint:'Choose a theme or code in the map or selector to read its saved codings.',
  evidenceList:'Saved codings', fullQuote:'Full quotation', openSource:'Open in document',
  sourceUnavailable:'This saved source cannot be verified. Open the document to review it before locating it.',
  backToMap:'Back to relationship map', sourceLocation:'Source location', clearLocation:'Clear location',
  evidenceChoose:'Choose a coding below to read its full quotation.', noEvidence:'No saved codings in this selection.',
  mapPreview:'The map shows up to 14 passage nodes per opened code. The list contains all saved codings in the selection.',
});
Object.assign(_T.zh, {
  motionSystem:'动态：跟随系统', motionReduced:'动态：减少', motionHint:'减少运动效果，或跟随系统设置',
  previousNode:'上一个主题或编码', nextNode:'下一个主题或编码', showPassages:'显示原句节点', hidePassages:'隐藏原句节点',
  codingsLabel:'标注关联', rangesLabel:'独立原句范围', rangeCodings:'条已保存标注', oneRange:'1 处原句范围', allRangeCodings:'此原句上的全部标注',
  networkKeys:'可用选择器或上一个／下一个选择；显示／隐藏只改变图中原句节点。Escape 清除选择。一个原句节点代表一条已保存标注；多条标注可以对应同一处原句范围。',
  noNetworkSelection:'尚未选择，请选择主题或编码。',
  insightsViews:'洞察视图', selectNetwork:'选择主题或编码', evidenceTitle:'原句证据',
  evidenceHint:'在关系图或选择器中选择主题或编码，阅读已保存的标注。', evidenceList:'已保存标注',
  fullQuote:'完整原句', openSource:'在文档中定位', sourceUnavailable:'无法核对这条原句的位置，请打开文档检查后再定位。',
  backToMap:'返回关系图', sourceLocation:'原句位置', clearLocation:'清除定位',
  evidenceChoose:'选择下方标注以阅读完整原句。', noEvidence:'当前选择没有已保存标注。',
  mapPreview:'每个展开的编码最多显示 14 个原句节点；列表包含当前选择的全部已保存标注。',
});
// UX-12 labels are presentation only; import/export formats and endpoints stay unchanged.
Object.assign(_T.en, {
  importDuplicate:'This document is already here', importDuplicateText:'“%s” has the same name and exact text. Keeping another copy creates a separate document, counted separately.', importKeep:'Keep another copy', cancelImport:'Cancel import', importChecking:'Checking document…',
  importFileMode:'Choose a file', importPasteMode:'Paste text', importShort:'Add a document to this project.',
  importFormats:'TXT / DOCX · UTF-8 · up to 8 MB', importHelp:'Format details',
  importTableLink:'Import a coding table instead', importTableShort:'Create a new project from a coding export.',
  importReady:'Text preview', importDocxReady:'Text opens after import.', importedLocal:'Imported · saved locally',
  importName:'Document name', importPaste:'Transcript', importEmpty:'Choose a TXT or DOCX file, or switch to Paste text.',
  exportShort:'Choose the file you need.', exportProjectName:'Project', exportProjectUse:'Restore and continue',
  exportCodingsName:'Codings', exportCodingsUse:'Quotes and source ranges', exportMatrixName:'Matrix', exportMatrixUse:'Documents × codes',
  exportMethodsName:'Methods', exportMethodsUse:'Recorded research steps', exportChoose:'Your file will appear here.',
  exportPreparing:'Preparing file…', exportSent:'Sent to browser', exportCheck:'Check your browser’s downloads for completion.',
  exportPreview:'Preview · first lines', exportPrivate:'Project JSON includes the source text.',
  plotEnlarge:'Enlarge figure', plotViewer:'Figure viewer', plotActual:'Actual size (100%)',
  plotFit:'Fit width', plotZoomIn:'Zoom in', plotZoomOut:'Zoom out', plotPan:'Scrollable figure',
  plotViewHint:'Swipe or scroll to explore. Arrow keys move; + / − zoom; 0 resets.',
  plotSvg:'Download SVG', plotClose:'Close figure', plotScale:'Magnification',
});
Object.assign(_T.zh, {
  importDuplicate:'此文档已存在', importDuplicateText:'“%s”的名称和正文完全相同。保留另一份会新增独立文档，并单独计数。', importKeep:'保留另一份', cancelImport:'取消导入', importChecking:'正在检查文档…',
  importFileMode:'选择文件', importPasteMode:'粘贴文本', importShort:'将文档加入当前项目。',
  importFormats:'TXT / DOCX · UTF-8 · 最大 8 MB', importHelp:'格式说明',
  importTableLink:'改为导入编码表', importTableShort:'从已有编码导出文件创建新项目。',
  importReady:'文本预览', importDocxReady:'导入后显示文档文本。', importedLocal:'已导入 · 保存在本地',
  importName:'文档名称', importPaste:'访谈文本', importEmpty:'请选择 TXT / DOCX 文件，或切换到粘贴文本。',
  exportShort:'选择需要的文件。', exportProjectName:'项目', exportProjectUse:'恢复并继续研究',
  exportCodingsName:'标注', exportCodingsUse:'原句与来源范围', exportMatrixName:'矩阵', exportMatrixUse:'文档 × 编码',
  exportMethodsName:'方法', exportMethodsUse:'已记录的研究步骤', exportChoose:'文件结果将显示在这里。',
  exportPreparing:'正在准备文件…', exportSent:'已发送至浏览器', exportCheck:'请在浏览器下载列表中确认完成。',
  exportPreview:'预览 · 文件开头', exportPrivate:'项目 JSON 包含源文档文本。',
  plotEnlarge:'放大查看图表', plotViewer:'图表查看器', plotActual:'原尺寸（100%）',
  plotFit:'适应宽度', plotZoomIn:'放大', plotZoomOut:'缩小', plotPan:'可滚动图表',
  plotViewHint:'滑动或滚动查看。方向键移动；+ / − 缩放；0 恢复原尺寸。',
  plotSvg:'下载 SVG', plotClose:'关闭图表', plotScale:'缩放比例',
});
// UX-24: roles describe saved tree positions, not a new analytic classification.
Object.assign(_T.en, {
  researchTheme:'Theme',researchCategory:'Category',researchRole:'Research role',roleUnassigned:'Not assigned',researchRoleHint:'You choose the role. It stays when the node moves and does not change counts.',
  importedCoding:'IMPORTED', codebookTree:'Themes & codes', themeGroup:'Theme / group', parentCode:'Parent code', codeRole:'Code',
  ungroupedCode:'Ungrouped code', codebookHint:'Saved parent relationships · counts include descendants',
  codebookFind:'Find a code', savedCodings:'saved codings', overlappingRanges:'Overlapping ranges',
  codeFilterLabel:'Code filter', codePathLabel:'Saved code path', overlapCodings:'Codings overlapping this range',
  codingHighlight:'Saved coding', codingHighlightFocus:'Focused coding', codingKeyHint:'Hover or focus a coding to trace its path.',
  popupChoosePath:'Several codes match this name or path. Choose one with ↑ / ↓ and Enter, or select its full path.',
});
Object.assign(_T.zh, {
  researchTheme:'主题',researchCategory:'类别',researchRole:'研究角色',roleUnassigned:'未指定',researchRoleHint:'由你指定角色；移动节点时保留，不改变计数。',
  importedCoding:'已导入', codebookTree:'主题与编码', themeGroup:'主题／分组', parentCode:'父编码', codeRole:'编码',
  ungroupedCode:'未归组编码', codebookHint:'已保存的父子关系 · 计数包含后代编码',
  codebookFind:'查找编码', savedCodings:'条已保存标注', overlappingRanges:'存在重叠范围',
  codeFilterLabel:'编码筛选', codePathLabel:'已保存的编码路径', overlapCodings:'与此范围重叠的标注',
  codingHighlight:'已编码', codingHighlightFocus:'当前聚焦标注', codingKeyHint:'悬浮或聚焦标注以查看所属路径。',
  popupChoosePath:'有多个编码匹配此名称或路径。请用 ↑ / ↓ 后按 Enter 明确选择，或选择完整路径。',
});
Object.assign(_T.zh, {
  readingNavigation:'阅读定位', readingDocument:'当前文档', readingPosition:'阅读位置',
  readingResumeHint:'返回本浏览器保存的段落。位置不表示已读。',readingResume:'返回位置',
  readingPaths:'当前位置的编码路径',readingHere:'此处编码',readingFocused:'聚焦编码',readingFilter:'筛选',
  readingNoCoding:'此处没有已保存标注',readingNoMatch:'没有匹配段落',readingParagraph:'段落',
  readingDetails:'文档详情与笔记',readingParagraphs:'段落',readingTools:'编码工具',
  readingMemoryNote:'仅记忆位置 · 保存在本机浏览器，不进入项目导出。滚动不会标记为已读。',
});
Object.assign(_T.zh, {
 help:'帮助',quickStart:'简短引导',guideImport:'导入一份文档',guideCode:'选择一段原句',guideInspect:'检查关系并导出',
 guideImportText:'选择 TXT、DOCX 文件，或粘贴文本。',guideCodeText:'选中准确的原句，再选择或创建编码。',guideInspectText:'从已保存编码核对原句，再下载结果。',
 guideReadOnly:'这是只读示例。可查看已有内容；导入与编码需使用本地项目。',guideRead:'打开文档',guideMap:'查看关系图',guideClose:'关闭简短引导',guideDone:'完成引导',guideNext:'下一步',guideSkip:'跳过',
 startEyebrow:'从下一份材料开始',startTitle:'从你的材料开始。',startIntro:'导入文档、试用示例，或继续已有工作。',startOwn:'你的项目',startOwnText:'从空工作台开始，准备好后添加第一份文档。',startProject:'新建项目',startImport:'导入文档',startExample:'试用 Bologna',startExampleText:'在独立、可编辑的示例副本中查看已有编码与原句。',
 startReadOnlyTitle:'选择只读示例。',startReadOnlyEmpty:'暂无可用示例项目',startReadOnlyInfo:'此工作台为只读模式。',continueLast:'继续上次项目',continueWork:'继续',chooseProject:'选择项目',restoreSafe:'恢复为独立新项目。',startLocal:'项目保存在当前工作区；上次项目和阅读位置仅由此浏览器记忆。',
 startName:'为项目命名',untitledProject:'未命名研究项目',startCreateNote:'先创建空项目，再选择文档。取消导入后仍可稍后继续。',createImport:'创建并导入',emptyEyebrow:'空项目',emptyTitle:'准备好第一份文档。',emptyText:'导入文本，阅读一段原句，再为它赋码。',optionalTools:'可选工具',
 bolognaLabel:'Bologna 示例',editableExample:'可在当前本地工作区编辑',startOwnAction:'新建自己的项目',moreProjectSources:'其他示例来源',backStart:'返回起步页',
});
Object.assign(_T.zh, {
  queueTitle:'批量导入队列', queueIntro:'TXT / DOCX · 每份最大 8 MB · 每队列最多 100 份，每项目最多 100 份文档。',
  queueAdd:'添加文件', queueReselect:'重新选择原文件', queueRestoreHint:'关闭后会在当前文件完成时停止。刷新后请重新选择原文件；浏览器只保存队列元数据。',
  queueProgress:'已处理文件', queuePause:'当前文件后停止', queueClear:'清除已保存／取消项', queueStart:'开始／继续', queueOpen:'查看／继续导入队列',
  queueChooseHint:'可同时选择多份文件，进入批量导入队列。', queueSaved:'已保存', queueFailed:'失败', queueCancelled:'已取消', queueDecisions:'待决定', queueTotal:'总数',
  queueStopping:'当前文件完成后停止…', queueRunning:'正在导入…', queueCancelFile:'取消此文件', queueRetry:'重试此文件', queueView:'查看文档',
  queueReselected:'份已重新选择，请开始／继续。', queueNoMatch:'未匹配到队列文件名，请重新选择原文件。',
  queueState_queued:'等待导入', queueState_reading:'正在读取文件…', queueState_checking:'正在核对文本…', queueState_saving:'正在保存…',
  queueState_saved:'已保存在本地', queueState_failed:'失败', queueState_duplicate:'名称和正文相同，请选择', queueState_cancelled:'已取消', 'queueState_needs-file':'请重新选择原文件',
});
const HOSTED_TEXT={en:{loading:'Opening your QT workspace…',localWorkspace:'Online workspace',savedLocally:'Saved on server',cloudNote:'Private account · persistent storage',workspaceIdentity:'QT 0.1 · ONLINE WORKSPACE',projectCreated:'Project created and saved on the server.',queueState_saved:'Saved on server',editableExample:'Editable in your private workspace',startLocal:'Projects and snapshots are saved in your private server workspace. Reading positions belong to this browser.'},zh:{loading:'正在打开 QT 工作台…',localWorkspace:'在线工作台',savedLocally:'已保存到服务器',cloudNote:'独立账号 · 持久存储',workspaceIdentity:'QT 0.1 · 在线工作台',projectCreated:'项目已创建并保存到服务器。',queueState_saved:'已保存到服务器',editableExample:'可在你的独立工作区编辑',startLocal:'项目和快照保存在你的独立服务器工作区。阅读位置保存在此浏览器。'}};
function QT(k,fb){const hosted=typeof window!=='undefined'&&window.QT_HOSTED;if(hosted&&HOSTED_TEXT[QT_LANG]?.[k])return HOSTED_TEXT[QT_LANG][k];const d=_T[QT_LANG];return(d&&d[k])||fb||k;}
function hostedAccountHtml(){return window.QT_HOSTED?`<form class="hosted-account" action="/auth/logout" method="post"><input type="hidden" name="signout" value="1"><span>${esc(state.config.account||'')}</span><button type="submit">${QT_LANG==='zh'?'退出登录':'Sign out'}</button></form>`:'';}
document.documentElement.lang = QT_LANG === 'zh' ? 'zh-CN' : 'en';
if(QT_LANG==='zh'){document.title='QualiCraft \u00b7 \u8d28\u6027\u7814\u7a76\u5de5\u4f5c\u53f0';}
'use strict';
const $ = (s, root = document) => root.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cp = s => Array.from(s);
// A browser preference only: never stored in projects, audit or backups.
let motionPreference='system';
try { if(localStorage.getItem('qualicraft-motion')==='reduce') motionPreference='reduce'; } catch(e) {}
function applyMotionPreference() {
  document.documentElement.setAttribute?.('data-reduced-motion',String(motionPreference==='reduce'));
}
applyMotionPreference();
function motionLabel() { return QT(motionPreference==='reduce'?'motionReduced':'motionSystem',motionPreference==='reduce'?'Motion: reduced':'Motion: system'); }

const cut = (s, a, b) => cp(s).slice(a, b).join('');
Object.assign(_T.zh,{ovOverview:'概览',ovRead:'项目阅读标记',ovReadKey:'已读',ovRevisitKey:'待回看',ovMap:'全文双轨概览。选择位置预览段落，使用精确列表跳转。',ovSaved:'已有编码范围',ovCp:'字符',ovCurrent:'当前位置',ovPreview:'预览',ovTrackHint:'细范围使用最小可见宽度；准确端点见下方列表。',ovPrevious:'上一页',ovNext:'下一页',ovEntire:'全文',ovRanges:'原句范围',ovFullJump:'显示全文并跳转',ovJump:'转到原文',ovNoParagraph:'没有非空段落',ovInactive:'旧阅读标记已失效；现有编码范围不变。',ovKeep:'保留此阅读位置',ovFilterHint:'双轨与列表始终覆盖全文；只有明确选择显示全文才清除搜索和编码筛选。',ovParagraphList:'精确段落列表',ovParagraphNumber:'段落编号',ovSourceList:'精确原句范围列表',ovScope:'列表范围',ovTouching:'涉及段落',ovRangeNumber:'当前列表中的范围编号',ovNoRanges:'没有已保存的编码范围',ovOriginal:'原始原句范围',ovAssignment:'标注 ID',ovCodeId:'编码 ID',ovUnits:'原句范围是本文中一个原始 [起点, 终点) 对，可关联多个编码。各段的涉及数量不能相加；连续笔迹只是视觉并集，不代表共现。',ovMemory:'预览和跳转不标记已读、不覆盖 Resume；选择保留此阅读位置才更新浏览器记忆。',ovJumped:'原文预览。Resume 可返回保存的位置。'});
const state = {token:'', projects:[], project:null, docId:null, view:'coding', search:'', codeFilter:null, selection:null, reviewFilter:'pending', config:{}, jobs:[], collapsed:new Set(), sideFilter:'', codebookOpen:false, backups:[], backupStatus:null, insightsTab:'map', sourceFocus:null, networkReturn:null};
Object.assign(_T.zh, {markRefreshFailed:'暂时无法取得最新标记 · 请重试刷新',markExport:'v5 JSON 包含项目阅读标记，旧版本 QT 无法打开。阅读标记随下一次研究编辑快照收录；现在导出 JSON 可单独保留。',projectMarks:'项目阅读标记',projectMark:'项目标记',mark_unmarked:'○ 未标记',mark_read:'✓ 已读',mark_revisit:'↺ 待回看',markRead:'标为已读',markUndo:'撤销',markRetry:'重试',markSaving:'保存中…',markSaved:'项目标记已保存',markNotSaved:'未保存',markRecheck:'需重新核对',markReadonly:'项目标记 · 只读',markReset:'重置标记…',markConflict:'其他位置已修改 · 请核对后重选',markResetConfirm:'原文已改变。清除这些项目阅读标记并绑定当前原文？重置前会检查一份恢复快照。',markPolicy:'标记是随文件共享的手动工作状态，不证明阅读或理解。标记即时保存到项目，随下一次研究编辑快照收录；现在导出 JSON 可保留当前状态。v5 JSON 需要当前版本的 QT。'});

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
  'reading-mark-read', 'reading-mark-undo', 'reading-mark-retry', 'reading-mark-reset',
  'import', 'run-import', 'import-export-open', 'code', 'save-code', 'code-save',
  'document-remove-review', 'document-remove-confirm', 'code-delete', 'code-delete-ask', 'code-merge', 'code-merge-ask', 'save-document', 'keep-document', 'queue-start', 'queue-keep', 'queue-retry',
  'save-memo', 'save-annotation', 'annotate', 'annotation', 'remove-annotation',
  'save-blocks', 'enable-all-blocks', 'new-project', 'restore-pick', 'review', 'analyze',
  'analyze-selection', 'start-analysis', 'popup-apply', 'popup-create',
  'start-project', 'start-create', 'bologna-project', 'demo-project', 'grounded-project', 'benchmark-project', 'reference-project',
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
let toastTimer, pollTimer, ioReturnFocus;
function toast(message, error=false) { const el=$('#toast'); el.textContent=message; el.className='visible'+(error?' error':''); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.className='',6000); }
// When the workbench is proxied behind the site, /config.js sets QT_BASE to the
// prefix it is mounted at. Standalone, the base is empty and every path is root.
const QT_BASE = (typeof window !== 'undefined' && window.QT_BASE) || '';
const projectVersions=new WeakMap();
let codingSaveQueue=Promise.resolve();
async function api(path, body, {rawJson=false,compact=false,compactVersion=null}={}) {
  if (body && state.config.public_demo) {
    throw new Error(QT('publicDemoReadOnly', 'This public demonstration is read-only. Start a local copy to create or change projects.'));
  }
  const url = path.startsWith('/api') ? QT_BASE + path : path;
  let payload=body?(rawJson?body:JSON.stringify(body)):undefined;
  const headers={'X-QualiCraft-Token':state.token,...(body?{'Content-Type':'application/json'}:{})};
  if(compact){headers['X-QT-Save-Response']='compact-v1';if(compactVersion)headers['X-QT-Project-Version']=compactVersion;}
  // Preserve raw frozen JSON bytes; compress transport only, with a fallback
  // for browsers without CompressionStream. Never stringify the parsed file.
  if(rawJson&&typeof payload==='string'&&payload.length>65536&&typeof CompressionStream!=='undefined'){
    const packed=await new Response(new Blob([payload]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
    if(packed.byteLength<new Blob([payload]).size){payload=packed;headers['Content-Encoding']='gzip';}
  }
  const response = await fetch(url, {method:body ? 'POST':'GET',headers,...(body?{body:payload}:{})});
  if(response.status===401&&window.QT_HOSTED){window.location.assign('/login');throw new Error('Sign in to continue.');}
  const data = await response.json(); if(!response.ok) { const error=new Error(data.error || 'Request failed'); error.status=response.status; throw error; }
  const version=response.headers?.get?.('X-QT-Project-Version');
  if(version&&Array.isArray(data?.documents)&&Array.isArray(data?.codes))projectVersions.set(data,version);
  return data;
}
function applyCodingReceipt(current,receipt){
  if(receipt.project_id!==current.id||!/^[a-f0-9]{64}$/.test(receipt.version))throw Error('Invalid save receipt');
  let next;
  if(receipt.project){next=receipt.project;if(next.id!==current.id)throw Error('Wrong saved project');}
  else{
    if(receipt.base_version!==projectVersions.get(current)||!receipt.patch)throw Error('Save baseline changed');
    next={...current};
    for(const [key,change] of Object.entries(receipt.patch)){
      if(['__proto__','constructor','prototype'].includes(key))throw Error('Invalid save field');
      if(change.op==='set')next[key]=change.value;
      else if(change.op==='remove')delete next[key];
      else if(change.op==='splice'){
        const old=next[key],{start,delete:count,items}=change;
        if(!Array.isArray(old)||!Number.isInteger(start)||!Number.isInteger(count)||start<0||count<0||start+count>old.length||!Array.isArray(items))throw Error('Invalid save range');
        next[key]=[...old.slice(0,start),...items,...old.slice(start+count)];
      }else throw Error('Unknown save change');
    }
  }
  if(next.id!==current.id||!Array.isArray(next.documents)||!Array.isArray(next.codes)||!Array.isArray(next.annotations)||!Array.isArray(receipt.backups)||!receipt.backup_status||receipt.summary?.id!==current.id||receipt.summary.updated_at!==next.updated_at)throw Error('Incomplete save receipt');
  projectVersions.set(next,receipt.version);return next;
}
function saveCoding(action,body){
  const id=state.project.id;
  const task=codingSaveQueue.then(async()=>{
    const current=state.project?.id===id?state.project:null;
    const receipt=await api(`/api/projects/${id}/${action}`,body,{compact:true,compactVersion:current?projectVersions.get(current):null});
    if(state.project?.id!==id)return receipt.result??receipt;
    if(receipt.format!=='qt-save-v1'){await refresh();return receipt;}
    let next;
    try{next=applyCodingReceipt(state.project,receipt);}
    catch(_){
      // The write already committed: read authoritative state, never replay it.
      try{await refresh();}catch(_){throw Error('Saved on the server. Refresh to load the latest project and recovery points.');}
      return receipt.result;
    }
    state.project=next;state.backups=receipt.backups;state.backupStatus=receipt.backup_status;
    state.projects=state.projects.map(p=>p.id===id?receipt.summary:p).sort((a,b)=>b.updated_at.localeCompare(a.updated_at));
    return receipt.result;
  });
  codingSaveQueue=task.catch(()=>{});return task;
}
const projectUrl = action => `${QT_BASE}/api/projects/${state.project.id}${action?'/'+action:''}`;
const doc = () => state.project?.documents.find(d=>d.id===state.docId);
const codesFor = a => state.project.codes.find(c=>c.id===a.code_id);
function codeLineage(code) {
  const byId=new Map(state.project.codes.map(c=>[c.id,c])), parts=[code], seen=new Set([code.id]);
  let cur=code;
  while(cur.parent_id&&byId.has(cur.parent_id)&&!seen.has(cur.parent_id)) {
    cur=byId.get(cur.parent_id);seen.add(cur.id);parts.unshift(cur);
  }
  return parts;
}
function codePath(code) { return codeLineage(code).map(c=>c.name).join(' > '); }
function codeRole(code) {
  if(['theme','category','code'].includes(code.research_role))return {theme:QT('researchTheme','Theme'),category:QT('researchCategory','Category'),code:QT('codeRole','Code')}[code.research_role];
  const grouped=state.project.codes.some(c=>c.id===code.parent_id), parent=state.project.codes.some(c=>c.parent_id===code.id);
  return QT(!grouped?(parent?'themeGroup':'ungroupedCode'):(parent?'parentCode':'codeRole'));
}
function codeIdentity(code) {
  const path=codePath(code);
  return state.project.codes.filter(c=>codePath(c)===path).length>1?`${path} · ${code.id}`:path;
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
// Only saved ancestry is drawn. Root codes without children are not called themes.
function codingSourceLabel(annotation) {
  const label={manual:'human',researcher_reference:'reference',ai_reviewed:'aiReviewed',imported:'importedCoding'}[annotation.source];
  return label?QT(label):annotation.source;
}
function marginHtml(matches) {
  if(!matches.length)return '';
  const roots=new Map();
  matches.forEach(a=>{
    const code=codesFor(a);if(!code)return;
    let level=roots;
    codeLineage(code).forEach((c,i,path)=>{if(!level.has(c.id))level.set(c.id,{code:c,children:new Map(),items:[]});const node=level.get(c.id);if(i===path.length-1)node.items.push(a);level=node.children;});
  });
  const nodeHtml=node=>{
    const c=node.code, label=codeRole(c);
    const header=`<button class="margin-node-label" data-action="filter-code" data-id="${c.id}" title="${esc(codeIdentity(c))}"><span class="code-role">${esc(label)}</span><span class="margin-theme-name">${esc(c.name)}${codeIdentity(c)!==codePath(c)?`<small class="code-identity-id">${esc(c.id)}</small>`:''}</span></button>`;
    return `<li data-coding-node="${c.id}">${header}${node.items.map(a=>`<button class="pill" data-action="annotation" data-id="${a.id}" data-code-id="${c.id}" aria-label="${esc(codeIdentity(c))} · [${a.start}, ${a.end})" title="${esc(codeIdentity(c))}"><span class="coding-range">[${a.start}, ${a.end}) ↗</span><span class="source">${esc(codingSourceLabel(a))}</span></button>`).join('')}${node.children.size?`<ul>${[...node.children.values()].map(nodeHtml).join('')}</ul>`:''}</li>`;
  };
  const overlap=matches.some((a,i)=>matches.slice(i+1).some(b=>a.start<b.end&&b.start<a.end));
  return `<div class="margin-summary">${matches.length} ${QT('savedCodings')}${overlap?`<span>${QT('overlappingRanges')}</span>`:''}<span class="coding-preview-path"></span></div><ul class="margin-tree">${[...roots.values()].map(nodeHtml).join('')}</ul>`;
}
function codingDetailsHtml(annotation) {
  const code=codesFor(annotation),others=state.project.annotations.filter(a=>a.document_id===annotation.document_id&&a.start<annotation.end&&a.end>annotation.start);
  return `<p class="coding-detail-path"><span class="code-role">${QT('codePathLabel')}</span>${esc(codeIdentity(code))}</p><blockquote class="big-quote">${esc(annotation.quote)}</blockquote><p>Source range [${annotation.start}, ${annotation.end}) · ${esc(annotation.source)}</p><button type="button" data-action="coding-locate" data-id="${annotation.id}">${QT('openSource')}</button>${others.length>1?`<details class="coding-overlaps"><summary>${others.length} · ${QT('overlapCodings')}</summary>${others.map(a=>`<button data-action="annotation" data-id="${a.id}" aria-pressed="${a.id===annotation.id}">${esc(codeIdentity(codesFor(a)))}<small>[${a.start}, ${a.end})</small></button>`).join('')}</details>`:''}`;
}
let codingPreview=[];
function previewCoding(ids=[]) {
  codingPreview=ids;
  const pinned=inspectorReturn()?(codingInspector.ids.length?codingInspector.ids:inspectorCurrent()?[inspectorCurrent().id]:[]):[];
  const effective=ids.length?ids:pinned.length?pinned:(state.sourceFocus?[state.sourceFocus]:[]),chosen=new Set(effective),path=new Set();
  state.project?.annotations.filter(a=>chosen.has(a.id)).forEach(a=>{const c=codesFor(a);if(c)codeLineage(c).forEach(c=>path.add(c.id));});
  document.querySelectorAll('.passage mark[data-coding-ids]').forEach(mark=>mark.classList.toggle('coding-active',JSON.parse(mark.dataset.codingIds).some(id=>chosen.has(id))));
  document.querySelectorAll('.pill[data-code-id]').forEach(pill=>pill.classList.toggle('coding-active',chosen.has(pill.dataset.id)));
  document.querySelectorAll('.margin-tags').forEach(margin=>{const label=margin.querySelector('.coding-preview-path');if(!label)return;const own=[...margin.querySelectorAll('.pill[data-code-id]')].filter(el=>chosen.has(el.dataset.id)),names=[...new Set(own.map(el=>{const c=state.project.codes.find(c=>c.id===el.dataset.codeId);return c?codeIdentity(c):''}))];const first=margin.querySelector('.pill[data-code-id]'),fallback=first&&state.project.codes.find(c=>c.id===first.dataset.codeId);label.textContent=names.join(' · ')||(fallback?codeIdentity(fallback):'');});
  document.querySelectorAll('[data-coding-node],[data-code-node]').forEach(node=>node.classList.toggle('coding-path-active',path.has(node.dataset.codingNode||node.dataset.codeNode)));
  updateReadingPath();
}
// UX77: one Coding workspace tree and an ephemeral source-inspection return.
// These fields never enter project JSON, audit, snapshots or browser storage.
let codingInspector={mode:'tree',query:'',codeId:null,ids:[],index:0,returnTo:null,drawer:false};
function inspectorWide(){return typeof window.innerWidth!=='number'||window.innerWidth>1000;}
function inspectorTitle(){return QT('inspectorTitle','Themes / Categories / Codes');}
function inspectorRole(code){return ['theme','category','code'].includes(code.research_role)?{theme:QT('researchTheme','Theme'),category:QT('researchCategory','Category'),code:QT('codeRole','Code')}[code.research_role]:QT('roleUnassigned','Not assigned');}
function inspectorReturn(){
  const saved=codingInspector.returnTo,d=doc();
  return saved&&d&&state.view==='coding'&&saved.projectId===state.project?.id&&saved.documentId===d.id&&saved.text===d.text?saved:null;
}
function resetCodingInspector(){parkedInspector=null;codingInspector={mode:'tree',query:'',codeId:null,ids:[],index:0,returnTo:null,drawer:false};}
function beginCodingInspection(){
  if(inspectorReturn())return;
  const d=doc();if(!d)return;
  const first=segments(d.text)[0]?.start??0;
  const start=(readingMounted?.filtered?readingMounted.start:readingSearchPosition()?.start??readingMounted?.readingStart??readingMounted?.start)??readReadingPosition(state.project,d)?.start??first;
  codingInspector.returnTo={projectId:state.project.id,documentId:d.id,text:d.text,start,search:state.search,codeFilter:state.codeFilter,sourceFocus:state.sourceFocus,searchReturn:readingSearchReturn,overviewNav:readingOverviewNav,overviewFocus:readingOverviewFocus,overviewOpen:readingOverview.open};
}
function inspectorMatches(){
  if(!inspectorReturn())return [];
  const ids=new Set(codingInspector.ids),scope=codingInspector.codeId?new Set([codingInspector.codeId,...codeDescendants(codingInspector.codeId)]):null;
  return state.project.annotations.filter(a=>a.document_id===state.docId&&(scope?scope.has(a.code_id):ids.has(a.id))).sort((a,b)=>a.start-b.start||a.end-b.end||a.id.localeCompare(b.id));
}
function inspectorCurrent(){const items=inspectorMatches();return items[Math.min(codingInspector.index,Math.max(0,items.length-1))]||null;}
function inspectorExpand(ids){
  ids.forEach(id=>{const code=state.project.codes.find(c=>c.id===id);if(code)codeLineage(code).forEach(c=>state.collapsed.delete(c.id));});
}
function selectInspectorCode(id){
  if(!state.project?.codes.some(c=>c.id===id))return;
  beginCodingInspection();codingInspector.mode='tree';codingInspector.codeId=id;codingInspector.ids=[];codingInspector.index=0;
  inspectorExpand([id]);refreshInspector();focusInspectorSource();
  [...document.querySelectorAll('#inspector-tree [data-action="inspect-code"]')].find(el=>el.dataset.id===id)?.focus({preventScroll:true});
}
function inspectCodings(ids){
  const items=state.project?.annotations.filter(a=>a.document_id===state.docId&&ids.includes(a.id))||[];if(!items.length)return;
  beginCodingInspection();codingInspector.mode='tree';codingInspector.codeId=null;codingInspector.ids=items.map(a=>a.id);codingInspector.index=0;
  inspectorExpand(items.map(a=>a.code_id));
  if(!inspectorWide())openCodingInspector(false);else refreshInspector();
  previewCoding(items.map(a=>a.id));
}
function focusInspectorSource(){
  const a=inspectorCurrent();if(!a)return;
  const paragraphs=[...document.querySelectorAll('#reader .paragraph')],paragraph=paragraphs.find(p=>Number(p.dataset.start)<=a.start&&Number(p.dataset.end)>a.start);
  if(paragraph){scrollReadingParagraph(Number(paragraph.dataset.start));previewCoding([a.id]);}
  refreshInspectorReadout();
}
function finishCodingInspection(here=false){
  const previous=inspectorReturn(),current=inspectorCurrent();
  const start=here&&current?segments(doc().text).find(p=>p.start<=current.start&&current.start<p.end)?.start:previous?.start;
  const drawer=codingInspector.drawer;
  if(previous&&!here){state.search=previous.search;state.codeFilter=previous.codeFilter;state.sourceFocus=previous.sourceFocus;readingSearchReturn=previous.searchReturn;readingOverviewNav=previous.overviewNav;readingOverviewFocus=previous.overviewFocus;readingOverview.open=previous.overviewOpen;}
  else if(here){state.sourceFocus=null;readingSearchReturn=null;readingOverviewNav=null;readingOverviewFocus=null;readingOverview.open=false;}
  codingInspector.mode='tree';codingInspector.codeId=null;codingInspector.ids=[];codingInspector.returnTo=null;codingInspector.index=0;codingInspector.drawer=false;
  const dlg=$('#dialog');if(drawer&&dlg?.dataset.workflow==='coding-inspector'){delete dlg.dataset.workflow;dlg.close();dlg.innerHTML='';}
  render();
  if(Number.isInteger(start)){scrollReadingParagraph(start,true);updateReadingPosition();}
}
function inspectorSelectionHtml(){
  const previous=inspectorReturn();if(!previous)return `<p class="inspector-hint">${QT('inspectHint','Select a tree node or a highlighted passage. Your full transcript stays in view.')}</p>`;
  const items=inspectorMatches(),a=inspectorCurrent(),code=codingInspector.codeId&&state.project.codes.find(c=>c.id===codingInspector.codeId);
  const selected=code?codeIdentity(code):QT('inspectPassage','Selected passage');
  const visible=a&&[...document.querySelectorAll('#reader .paragraph')].some(p=>Number(p.dataset.start)<=a.start&&Number(p.dataset.end)>a.start);
  return `<section class="inspector-selection" aria-label="${QT('inspectSelection','Current selection')}"><strong>${esc(selected)}</strong><p class="inspector-match-count" role="status">${items.length?`${codingInspector.index+1} / ${items.length} ${QT('inspectMatches','coded passages in this document')}`:QT('inspectNoMatch','No matching coded passages in this document.')}</p>
   ${items.length?`<div class="inspector-pager"><button data-action="inspect-prev"${codingInspector.index<=0?' disabled':''}>${QT('inspectPrevious','Previous passage')}</button><button data-action="inspect-next"${codingInspector.index>=items.length-1?' disabled':''}>${QT('inspectNext','Next passage')}</button></div>`:''}
   ${a?`<p class="inspector-path">${esc(codeIdentity(codesFor(a)))}</p><blockquote>${esc(a.quote)}</blockquote>${!visible&&(state.search||state.codeFilter)?`<p>${QT('inspectHidden','This passage is hidden by your current filters.')}</p><button data-action="inspect-show-all">${QT('ovFullJump','Show full text and jump')}</button>`:''}
   <details class="inspector-details"><summary>${QT('inspectDetails','Details and editing')}</summary><p>${esc(inspectorRole(codesFor(a)))} · [${a.start}, ${a.end}) · ${esc(codingSourceLabel(a))}</p>${codesFor(a).definition?`<p>${esc(codesFor(a).definition)}</p>`:''}${a.memo?`<p>${esc(a.memo)}</p>`:''}<button data-action="inspect-edit-coding" data-id="${a.id}">${QT('inspectEdit','Edit coding / memo')}</button><button data-action="code-edit" data-id="${a.code_id}"${demoLock()}>${QT('editCode','Edit code')}</button></details>`:''}
   ${code?`<button class="inspector-filter" data-action="inspect-filter" data-id="${code.id}">${QT('inspectFilter','Only show matching passages')}</button>`:''}</section>`;
}
function inspectorBodyHtml(){
  const pending=state.project.suggestions.filter(s=>s.document_id===state.docId&&s.status==='pending').length;
  return `<div class="inspector-tabs" role="group" aria-label="${QT('inspectViews','Coding panel')}"><button data-action="inspect-tree" aria-pressed="${codingInspector.mode==='tree'}">${inspectorTitle()}</button>${hasBlock('ai')?`<button data-action="inspect-ai" aria-pressed="${codingInspector.mode==='ai'}">${QT('suggestions','Suggestions')} (${pending})</button>`:''}</div>
  <div class="inspector-return"><button data-action="inspect-return"${inspectorReturn()?'':' disabled'}>${QT('inspectReturn','\u2190 Continue coding')}</button>${inspectorReturn()?`<button data-action="inspect-here">${QT('inspectHere','Continue here')}</button>`:''}</div>
  ${codingInspector.mode==='ai'&&hasBlock('ai')?`<div class="inspector-ai"><p class="inspector-hint">${QT('reviewSubtitle')}</p><label for="review-filter" class="sr-only">${QT('inspectReviewStatus','Suggestion status')}</label><select id="review-filter">${['pending','accepted','rejected'].map(v=>`<option value="${v}"${v===state.reviewFilter?' selected':''}>${QT(v==='pending'?'pending':v==='accepted'?'reviewAccepted':'reviewRejected')}</option>`).join('')}</select>${suggestionsHtml()}</div>`:
  `<div id="inspector-readout">${inspectorSelectionHtml()}</div><div class="inspector-tree-head"><label for="inspector-search">${QT('codebookFind','Find a code or group')}</label><input id="inspector-search" type="search" autocomplete="off" value="${esc(codingInspector.query)}"><button data-action="code"${demoLock()}>${QT('newCode','+ New code')}</button></div><div id="inspector-tree">${codebookHtml('inspector')}</div>`}`;
}
// Move one live tree across layouts; never replace the source or an edit form.
let parkedInspector=null;
function inspectorSurface(){
 const node=$('#coding-inspector-body'),d=doc();if(!d)return null;
 if(node){parkedInspector={project:state.project,document:d,node};return node;}
 if(parkedInspector?.project===state.project&&parkedInspector.document===d)return parkedInspector.node;
 const fresh=document.createElement('div');fresh.id='coding-inspector-body';fresh.innerHTML=inspectorBodyHtml();parkedInspector={project:state.project,document:d,node:fresh};return fresh;
}
function inspectorFocusSnapshot(node){const el=document.activeElement;return node?.contains(el)?{el,start:el.selectionStart,end:el.selectionEnd}:null;}
function restoreInspectorFocus(saved){if(!saved?.el.isConnected)return;saved.el.focus({preventScroll:true});if(Number.isInteger(saved.start)&&Number.isInteger(saved.end))saved.el.setSelectionRange?.(saved.start,saved.end);}
function syncCodingInspectorLayout(wide){
 const grid=$('.work-grid.coding-single'),dlg=$('#dialog');if(!grid||!doc())return;
 const node=inspectorSurface(),focus=inspectorFocusSnapshot(node),aside=grid.querySelector('.coding-inspector');
 if(wide){
  const wasDrawer=dlg?.open&&dlg.dataset.workflow==='coding-inspector';
  const top=wasDrawer?dlg.querySelector('.modal-body').scrollTop:parkedInspector?.top||0;
  let dock=aside;if(!dock){dock=document.createElement('aside');dock.className='coding-inspector';dock.setAttribute('aria-label',inspectorTitle());grid.appendChild(dock);}
  dock.appendChild(node);dock.scrollTop=top;
  if(wasDrawer){codingInspector.drawer=false;delete dlg.dataset.workflow;dlg.close();dlg.innerHTML='';}
  restoreInspectorFocus(focus);
 }else if(aside){
  parkedInspector.top=aside.scrollTop;node.remove();aside.remove();
  if(focus&&!dlg?.open&&!$('#code-popup')){openCodingInspector(false,true);restoreInspectorFocus(focus);}
 }
}
function refreshInspectorReadout(){const target=$('#inspector-readout');if(target)target.innerHTML=inspectorSelectionHtml();}
function refreshInspector(){
  const host=$('#coding-inspector-body'),dlg=$('#dialog');
  if(host){const top=host.scrollTop;host.innerHTML=inspectorBodyHtml();host.scrollTop=top;}
  else if(dlg?.open&&dlg.dataset.workflow==='coding-inspector')dlg.querySelector('.modal-body').innerHTML=inspectorBodyHtml()+'<div id="modal-error" role="alert"></div>';
  const a=inspectorCurrent();previewCoding(codingInspector.ids.length?codingInspector.ids:a?[a.id]:[]);
}
function openCodingInspector(protect=true,preserve=false){
  if(protect)beginReadingSearch();
  if(inspectorWide()){$('#inspector-search')?.focus({preventScroll:true});return;}
  const node=inspectorSurface();if(!node)return;if(!preserve)node.innerHTML=inspectorBodyHtml();
  codingInspector.drawer=true;
  modal(inspectorTitle(),' ',`<button data-action="inspect-close">${QT('inspectReturn','\u2190 Continue coding')}</button>`);
  const dlg=$('#dialog');dlg.dataset.workflow='coding-inspector';dlg.querySelector('.modal-body').prepend(node);
  if(parkedInspector?.top)dlg.querySelector('.modal-body').scrollTop=parkedInspector.top;
  $('#inspector-search')?.focus({preventScroll:true});
}
Object.assign(_T.zh,{inspectorTitle:'主题／类别／编码',inspectPrevious:'上一处原句',inspectNext:'下一处原句',inspectHint:'选择树节点或高亮原句，正文保持可见。',inspectPassage:'所选原句',inspectSelection:'当前选择',inspectMatches:'处原句（当前文档）',inspectNoMatch:'当前文档没有匹配的已编码原句。',inspectHidden:'当前筛选隐藏了这处原句。',inspectDetails:'详情与编辑',inspectEdit:'编辑编码／备忘录',inspectFilter:'仅显示匹配原句',inspectViews:'编码面板',inspectReturn:'← 继续编码',inspectHere:'在此继续',inspectReviewStatus:'建议状态'});
// Browser-local navigation only. No transcript, quote, read-completion state or
// project mutation is stored. A changed source invalidates its paragraph anchor.
function readingSignature(text) {
  let hash=2166136261;
  for(const char of text)hash=Math.imul(hash^char.codePointAt(0),16777619);
  return (hash>>>0).toString(16);
}
function readingKey(projectId,documentId) { return 'qt.reading.v1:'+JSON.stringify([projectId,documentId]); }
function readReadingPosition(project,document) {
  try {
    const saved=JSON.parse(localStorage.getItem(readingKey(project.id,document.id)));
    return saved?.version===1&&saved.length===cp(document.text).length&&saved.signature===readingSignature(document.text)&&Number.isInteger(saved.start)&&segments(document.text).some(p=>p.start===saved.start)?saved:null;
  }catch(_){return null;}
}
function writeReadingPosition(project,document,start) {
  if(!segments(document.text).some(p=>p.start===start))return false;
  try {
    localStorage.setItem(readingKey(project.id,document.id),JSON.stringify({version:1,start,length:cp(document.text).length,signature:readingSignature(document.text)}));
    localStorage.setItem(readingKey(project.id,null),JSON.stringify(document.id));return true;
  }catch(_){return false;}
}
function preferredReadingDocument(project) {
  try {const id=JSON.parse(localStorage.getItem(readingKey(project.id,null)));if(project.documents.some(d=>d.id===id))return id;}catch(_){}
  return project.documents[0]?.id;
}
function codingReadingPaths(start,ids=[]) {
  const d=doc();if(!d)return [];
  if(state.codeFilter){const c=state.project.codes.find(c=>c.id===state.codeFilter);return c?[codeIdentity(c)]:[];}
  const paragraph=segments(d.text).find(p=>p.start===start),chosen=new Set(ids);
  const annotations=state.project.annotations.filter(a=>a.document_id===d.id&&(chosen.size?chosen.has(a.id):paragraph&&a.start<paragraph.end&&a.end>paragraph.start));
  return [...new Set(annotations.map(a=>codesFor(a)).filter(Boolean).map(codeIdentity))];
}
// Project marks are server-confirmed metadata. Navigation remains browser-only.
let readingMarkTarget=null,readingFocusedStart=null;
const readingWrites=new Map(),readingFailures=new Map(),readingUndos=new Map();
function markKey(projectId,documentId){return JSON.stringify([projectId,documentId]);}
function markLabel(status){return QT('mark_'+status,({unmarked:'○ Unmarked',read:'✓ Read',revisit:'↺ Revisit'})[status]);}
function validReadingSource(d){const r=d?.reading_state;return !r||(r.source_sha256===d.sha256&&r.source_length===cp(d.text).length);}
function paragraphMark(d,start){return validReadingSource(d)?d.reading_state?.marks.find(m=>m.start===start)?.status||'unmarked':'unmarked';}
function visibleReadingFocus(){
  const p=[...document.querySelectorAll('#reader .paragraph')].find(p=>Number(p.dataset.start)===readingFocusedStart);
  if(!p)return null;
  const box=p.getBoundingClientRect(),dock=$('.reading-dock')?.getBoundingClientRect(),pane=$('#document-pane')?.getBoundingClientRect();
  return box.bottom>Math.max(dock?.bottom||0,pane?.top||0)&&box.top<Math.min(window.innerHeight,pane?.bottom||window.innerHeight)?p:null;
}
function currentMarkTarget(){
  const d=doc();if(!d)return null;
  if(readingMarkTarget?.projectId===state.project.id&&readingMarkTarget.documentId===d.id)return readingMarkTarget;
  const p=visibleReadingFocus()||readingParagraph();if(!p)return null;
  if(readingOverview.open&&p.getBoundingClientRect().top>=Math.min(window.innerHeight,$('#document-pane')?.getBoundingClientRect().bottom||window.innerHeight))return null;
  const paragraph=segments(d.text).find(s=>s.start===Number(p.dataset.start));if(!paragraph)return null;
  return {projectId:state.project.id,documentId:d.id,source_sha256:d.sha256,start:paragraph.start,end:paragraph.end,index:paragraph.index};
}
function freezeMarkTarget(){readingMarkTarget=currentMarkTarget();updateProjectMarks();}
function updateProjectMarks(){
  const d=doc(),bar=$('#reading-marks');if(!d||!bar)return;
  const target=currentMarkTarget(),key=markKey(state.project.id,d.id),pending=readingWrites.has(key),failure=readingFailures.get(key),stale=!validReadingSource(d);
  const select=$('#reading-mark-status'),button=$('[data-action="reading-mark-read"]'),undo=$('[data-action="reading-mark-undo"]'),retry=$('[data-action="reading-mark-retry"]'),reset=$('[data-action="reading-mark-reset"]');
  const status=target?paragraphMark(d,target.start):readingOverview.open?paragraphMark(d,readingMounted?.start):'unmarked';
  bar.title=!target&&readingOverview.open?QT('ovMarkHint','Go to the source text to edit a paragraph mark.'):'';
  if(select){select.value=status;select.disabled=!!state.config.public_demo||pending||failure?.blocked||stale||!target;select.setAttribute('aria-label',`${QT('projectMark','Project mark')} · ¶${target?target.index+1:'—'}`);}
  if(button){button.textContent=target?`${QT('markRead','Mark read')} · ¶${target.index+1}`:QT('markRead','Mark read');button.disabled=!!state.config.public_demo||pending||failure?.blocked||stale||!target;}
  if(undo)undo.disabled=!!state.config.public_demo||pending||failure?.blocked||!readingUndos.has(key)||stale;
  if(retry){retry.hidden=!failure?.retry;retry.disabled=pending;}
  if(reset){reset.hidden=!stale;reset.disabled=!!state.config.public_demo||pending||failure?.blocked;}
  const output=$('#reading-mark-save');if(output)output.textContent=pending?QT('markSaving','Saving…'):failure?failure.message:stale?QT('markRecheck','Needs recheck'):state.config.public_demo?QT('markReadonly','Project marks · read-only'):'';
  for(const p of document.querySelectorAll('#reader .paragraph')){
    const value=paragraphMark(d,Number(p.dataset.start)),badge=p.querySelector('.reading-mark-badge');
    p.dataset.readingMark=value;p.classList.toggle('reading-mark-target',!!target&&Number(p.dataset.start)===target.start);
    if(badge){badge.textContent=value==='read'?'✓':value==='revisit'?'↺':'';badge.title=markLabel(value);badge.setAttribute('role','img');badge.setAttribute('aria-label',markLabel(value));badge.hidden=value==='unmarked';}
  }
}
function acceptReadingResponse(projectId,result){
  if(state.project?.id!==projectId)return false;
  const d=state.project.documents.find(d=>d.id===result.document_id);if(!d)return false;
  if((d.reading_state?.revision||0)>result.reading_state.revision)return false;
  d.reading_state=result.reading_state;
  if(state.docId===d.id&&readingOverview.open)renderReadingOverview();
  projectVersions.delete(state.project);
  if(result.updated_at>state.project.updated_at)state.project.updated_at=result.updated_at;
  if(result.audit_event&&!state.project.audit.some(e=>e.id===result.audit_event.id))state.project.audit.push(result.audit_event);
  return true;
}
function announceMark(message){const output=$('#reading-announcement');if(output)output.textContent=message;}
async function refreshReadingMarks(projectId,documentId){
  const key=markKey(projectId,documentId);
  try{
    const latest=await api(`/api/projects/${projectId}`),current=latest.documents.find(x=>x.id===documentId);
    if(!current)throw Error('Document unavailable');
    acceptReadingResponse(projectId,{document_id:documentId,reading_state:current.reading_state,updated_at:latest.updated_at});
    readingFailures.set(key,{message:QT('markConflict','Changed elsewhere · review and choose again')});return true;
  }catch(_){
    readingFailures.set(key,{message:QT('markRefreshFailed','Latest marks unavailable · Retry to refresh'),blocked:true,retry:{refresh:true,projectId,documentId}});return false;
  }finally{if(state.project?.id===projectId&&state.docId===documentId)updateProjectMarks();}
}
async function saveReadingMark(status,{retry=null,undo=false,reset=false,targetOverride=null}={}){
  const target=retry?.target||targetOverride||currentMarkTarget();if(!target)return;
  const project=state.project,d=project?.documents.find(d=>d.id===target.documentId);
  if(!d||project.id!==target.projectId)return;
  const key=markKey(project.id,d.id);if(readingWrites.has(key))return;
  const body=retry?.body||{document_id:d.id,source_sha256:target.source_sha256,start:target.start,end:target.end,status,
    expected_revision:undo?readingUndos.get(key)?.revision:d.reading_state?.revision||0,request_id:crypto.randomUUID().replaceAll('-',''),...(reset?{confirmed:true}:{})};
  const previous=retry?.previous||paragraphMark(d,target.start);
  readingWrites.set(key,true);readingFailures.delete(key);updateProjectMarks();
  try{
    const result=await api(`/api/projects/${project.id}/${reset?'reading-reset':'reading-mark'}`,body);
    const applied=acceptReadingResponse(project.id,result);
    if(applied&&!reset&&!undo&&result.audit_event&&result.audit_event.revision===result.reading_state.revision)readingUndos.set(key,{...target,status:result.audit_event.before??previous,revision:result.reading_state.revision});
    if(undo||reset)readingUndos.delete(key);
    if(applied&&state.docId===d.id)announceMark(`${QT('markSaved','Project mark saved')} · ¶${target.index+1} · ${markLabel(reset?'unmarked':body.status)}`);
  }catch(error){
    if(error.status===409){
      readingUndos.delete(key);
      await refreshReadingMarks(project.id,d.id);
    }else readingFailures.set(key,{message:QT('markNotSaved','Not saved')+' · '+error.message,retry:{target,body,previous,reset,undo}});
    if(state.project?.id===project.id&&state.docId===d.id)announceMark(readingFailures.get(key).message);
  }finally{readingWrites.delete(key);if(state.project?.id===project.id&&state.docId===d.id)updateProjectMarks();}
}
document.addEventListener('pointerdown',e=>{if(e.target.closest?.('#reading-marks'))freezeMarkTarget();else{const p=e.target.closest?.('#reader .paragraph');if(p){readingFocusedStart=Number(p.dataset.start);readingMarkTarget=null;updateProjectMarks();}}});
document.addEventListener('focusin',e=>{
  const paragraph=e.target.closest?.('#reader .paragraph');if(paragraph){readingFocusedStart=Number(paragraph.dataset.start);readingMarkTarget=null;updateProjectMarks();}
  else if(e.target.closest?.('#reading-marks'))freezeMarkTarget();
});
document.addEventListener('focusout',e=>{if(e.target.closest?.('#reading-marks')&&!e.relatedTarget?.closest?.('#reading-marks')){readingMarkTarget=null;updateProjectMarks();}});

// UX-32B: derived navigation only. No project state or analysis is written here.
Object.assign(_T.zh,{ovPositionSaved:'已保存本浏览器阅读位置。',ovStorageUnavailable:'浏览器存储不可用，无法记忆此位置。'});
let readingOverview={key:null,open:false},readingOverviewNav=null,readingOverviewFocus=null;
function ensureReadingOverview(){
  const key=state.project&&doc()?markKey(state.project.id,doc().id):null;
  if(readingOverview.key!==key){readingOverview={key,open:false,paragraph:0,paragraphPage:0,sourcePage:0,sourceScope:'paragraph',rangeKey:null,returnStart:null};readingOverviewNav=null;readingOverviewFocus=null;}
  if(readingOverviewFocus?.key===key){
    const ids=state.project.annotations.filter(a=>a.document_id===doc().id&&a.start===readingOverviewFocus.start&&a.end===readingOverviewFocus.end&&codesFor(a)).map(a=>a.id);
    if(ids.length)readingOverviewFocus.ids=ids;else{readingOverviewFocus=null;readingOverview.rangeKey=null;}
  }
  return readingOverview;
}
function overviewBound(values,value,inclusive=false){
  let lo=0,hi=values.length;while(lo<hi){const mid=(lo+hi)>>>1;if(values[mid]<value||(inclusive&&values[mid]===value))lo=mid+1;else hi=mid;}return lo;
}
function readingOverviewData(project,d){
  const length=cp(d.text).length,codeIds=new Set(project.codes.map(c=>c.id)),ids=new Set(),groups=new Map();
  const annotations=project.annotations.filter(a=>{
    if(a.document_id!==d.id||!codeIds.has(a.code_id)||ids.has(a.id)||!Number.isInteger(a.start)||!Number.isInteger(a.end)||a.start<0||a.start>=a.end||a.end>length)return false;
    ids.add(a.id);return true;
  });
  for(const a of annotations){const key=`${a.start}:${a.end}`;if(!groups.has(key))groups.set(key,{key,start:a.start,end:a.end,annotations:[]});groups.get(key).annotations.push(a);}
  const ranges=[...groups.values()].sort((a,b)=>a.start-b.start||a.end-b.end),unions=[];
  for(const range of ranges){const last=unions.at(-1);if(last&&range.start<=last[1])last[1]=Math.max(last[1],range.end);else unions.push([range.start,range.end]);}
  const starts=annotations.map(a=>a.start).sort((a,b)=>a-b),ends=annotations.map(a=>a.end).sort((a,b)=>a-b),rangeStarts=ranges.map(g=>g.start),rangeEnds=ranges.map(g=>g.end).sort((a,b)=>a-b);
  const stale=!validReadingSource(d),marks=new Map(stale?[]:(d.reading_state?.marks||[]).map(m=>[m.start,m.status]));
  const paragraphs=segments(d.text).map(p=>({...p,status:marks.get(p.start)||'unmarked',codingCount:overviewBound(starts,p.end)-overviewBound(ends,p.start,true),rangeCount:overviewBound(rangeStarts,p.end)-overviewBound(rangeEnds,p.start,true)}));
  return {length,paragraphs,ranges,unions,codingCount:annotations.length,stale};
}
function overviewParagraphAt(paragraphs,offset){
  const index=overviewBound(paragraphs.map(p=>p.start),offset,true)-1;
  return Math.max(0,Math.min(paragraphs.length-1,index));
}
function overviewPreviewNavigation(){return !!readingOverviewNav&&readingOverviewNav.key===markKey(state.project?.id,doc()?.id);}
function overviewTrackHtml(data){
  const x=offset=>data.length?offset/data.length*1000:0;
  const rect=(start,end,y,kind)=>`<rect data-start="${start}" data-end="${end}" class="overview-stroke ${kind}" x="${Math.min(999.2,x(start))}" y="${y}" width="${Math.min(1000-x(start),Math.max(.8,x(end)-x(start)))}" height="14"/>`;
  return `<div class="overview-track-label"><span>${QT('ovRead','Project read marks')}</span><span>✓ ${QT('ovReadKey','Read')} · ↺ ${QT('ovRevisitKey','Revisit')}</span></div><svg id="reading-overview-map" viewBox="0 0 1000 64" preserveAspectRatio="none" role="img" aria-label="${QT('ovMap','Two tracks across the entire document. Select a position to preview a paragraph; use the exact lists to jump.')}"><defs><pattern id="qt-overview-revisit" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#f3e6cb"/><path d="M0 6L6 0" stroke="#805b21" stroke-width="2"/></pattern></defs><path d="M0 12H1000M0 47H1000" stroke="#d7dce1" stroke-width="14"/>${data.paragraphs.filter(p=>p.status!=='unmarked').map(p=>rect(p.start,p.end,5,p.status)).join('')}${data.unions.map(([start,end])=>rect(start,end,40,'coding')).join('')}<line id="overview-current-line" y1="0" y2="64" stroke="#202a37" stroke-width="2"/><line id="overview-preview-line" x1="${x(data.paragraphs[readingOverview.paragraph]?.start||0)}" x2="${x(data.paragraphs[readingOverview.paragraph]?.start||0)}" y1="0" y2="64" stroke="#805b21" stroke-width="2" stroke-dasharray="4 3"/></svg><div class="overview-track-label"><span>${QT('ovSaved','Saved coding ranges')}</span><span>0 → ${data.length.toLocaleString()} ${QT('ovCp','code points')}</span></div><p class="overview-key">│ ${QT('ovCurrent','Current position')} · ┆ ${QT('ovPreview','Preview')} · ${QT('ovTrackHint','Strokes may have a minimum visible width; exact ranges are listed below.')}</p>`;
}
function overviewPagerHtml(kind,page,total,size){
  const pages=Math.max(1,Math.ceil(total/size));return `<div class="overview-pager"><button data-action="overview-page" data-kind="${kind}" data-direction="previous" data-page="${page-1}" ${page===0?'disabled':''}>← ${QT('ovPrevious','Previous')}</button><span>${page+1} / ${pages}</span><button data-action="overview-page" data-kind="${kind}" data-direction="next" data-page="${page+1}" ${page+1>=pages?'disabled':''}>${QT('ovNext','Next')} →</button></div>`;
}
function readingOverviewHtml(){
  ensureReadingOverview();if(!readingOverview.open)return '';
  const d=doc(),data=readingOverviewData(state.project,d),o=readingOverview;
  o.paragraph=Math.max(0,Math.min(o.paragraph,data.paragraphs.length-1));
  const p=data.paragraphs[o.paragraph],scope=o.sourceScope==='paragraph'&&p?data.ranges.filter(g=>g.start<p.end&&g.end>p.start):data.ranges;
  o.paragraphPage=Math.max(0,Math.min(o.paragraphPage,Math.ceil(data.paragraphs.length/12)-1));o.sourcePage=Math.max(0,Math.min(o.sourcePage,Math.ceil(scope.length/10)-1));
  const selected=data.ranges.find(g=>g.key===o.rangeKey),scopeLabel=o.sourceScope==='paragraph'?`¶${p?p.index+1:'—'}`:QT('ovEntire','Entire document');
  const jump=selected||p,shown=new Set([...document.querySelectorAll?.('#reader .paragraph')||[]].map(el=>Number(el.dataset.start))),touching=jump?data.paragraphs.filter(row=>row.start<jump.end&&row.end>jump.start):[],visible=touching.length>0&&touching.every(row=>shown.has(row.start)),filtered=!!(state.search||state.codeFilter);
  const jumpAction=filtered&&!visible?'overview-show-full':selected?'overview-jump-source':'overview-jump-paragraph';
  const button=jump?`<button data-action="${jumpAction}"${!touching.length?' disabled':''}>${jumpAction==='overview-show-full'?QT('ovFullJump','Show full document & jump'):QT('ovJump','Go to source')} ${selected?`[${selected.start}, ${selected.end})`:`¶${p.index+1}`}</button>`:'';
  const excerpt=p?cp(p.text).slice(0,140).join('')+(cp(p.text).length>140?'…':''):QT('ovNoParagraph','No nonempty paragraphs');
  const paragraphRows=data.paragraphs.slice(o.paragraphPage*12,o.paragraphPage*12+12).map(row=>`<li><button data-action="overview-select-paragraph" data-index="${row.index}" aria-pressed="${row.index===o.paragraph}"><strong>¶${row.index+1} · ${markLabel(row.status)}</strong><span>[${row.start}, ${row.end}) · ${row.codingCount} ${QT('savedCodings','saved codings')} · ${row.rangeCount} ${QT('ovRanges','source ranges')}</span></button></li>`).join('');
  const rangeRows=scope.slice(o.sourcePage*10,o.sourcePage*10+10).map(g=>`<li><button data-action="overview-select-source" data-key="${g.key}" aria-pressed="${g.key===o.rangeKey}"><strong>[${g.start}, ${g.end})</strong><span>${g.annotations.length} ${QT('savedCodings','saved codings')}</span></button></li>`).join('');
  return `<header class="overview-heading"><h2 id="overview-title">${QT('ovEntire','Entire document')}</h2><span>${data.paragraphs.length} ${QT('readingParagraphs','paragraphs')} · ${data.codingCount} ${QT('savedCodings','saved codings')} · ${data.ranges.length} ${QT('ovRanges','source ranges')}</span></header>${data.stale?`<p class="overview-warning">${QT('markRecheck','Needs recheck')} · ${QT('ovInactive','Old reading marks are inactive; saved coding ranges are unchanged.')}</p>`:''}${overviewTrackHtml(data)}<output id="overview-current-label"></output><section class="overview-preview" aria-label="${QT('ovPreview','Preview')}"><h3>¶${p?p.index+1:'—'} · ${p?markLabel(p.status):'—'}</h3><p>${esc(excerpt)}</p><p class="overview-exact">${p?`[${p.start}, ${p.end}) · ${p.codingCount} ${QT('savedCodings','saved codings')} · ${p.rangeCount} ${QT('ovRanges','source ranges')}`:''}</p>${selected?'':button}${overviewPreviewNavigation()?`<button data-action="overview-keep">${QT('ovKeep','Keep this reading position')}</button>`:''}${filtered?`<p>${QT('ovFilterHint','Tracks and lists cover the entire document. Existing search and code filters remain until you explicitly show the full document.')}</p>`:''}</section>
    <details id="overview-paragraph-list"><summary>${QT('ovParagraphList','Exact paragraphs')} · ${data.paragraphs.length}</summary><div class="overview-number"><label for="overview-paragraph-number">${QT('ovParagraphNumber','Paragraph number')}</label><input id="overview-paragraph-number" type="number" min="1" max="${Math.max(1,data.paragraphs.length)}" value="${p?p.index+1:1}"><button data-action="overview-find-paragraph">${QT('ovPreview','Preview')}</button></div><ol class="overview-list">${paragraphRows}</ol>${overviewPagerHtml('paragraph',o.paragraphPage,data.paragraphs.length,12)}</details>
    <details id="overview-source-list"><summary>${QT('ovSourceList','Exact source ranges')} · ${scope.length}</summary><label class="overview-scope" for="overview-source-scope">${QT('ovScope','List scope')}<select id="overview-source-scope"><option value="paragraph" ${o.sourceScope==='paragraph'?'selected':''}>${QT('ovTouching','Touching')} ¶${p?p.index+1:'—'}</option><option value="document" ${o.sourceScope==='document'?'selected':''}>${QT('ovEntire','Entire document')}</option></select></label><p>${esc(scopeLabel)} · ${scope.length} ${QT('ovRanges','source ranges')}</p><div class="overview-number"><label for="overview-range-number">${QT('ovRangeNumber','Range number in this list')}</label><input id="overview-range-number" type="number" min="1" max="${Math.max(1,scope.length)}" value="1"><button data-action="overview-find-source" ${scope.length?'':'disabled'}>${QT('ovPreview','Preview')}</button></div><ol class="overview-list">${rangeRows}</ol>${scope.length?'':`<p>${QT('ovNoRanges','No saved coding ranges')}</p>`}${overviewPagerHtml('source',o.sourcePage,scope.length,10)}</details>
    ${selected?`<section class="overview-source-detail"><h3 tabindex="-1">${QT('ovOriginal','Original source range')} [${selected.start}, ${selected.end})</h3><blockquote>${esc(cut(d.text,selected.start,selected.end))}</blockquote><ul>${selected.annotations.map(a=>`<li data-annotation-id="${esc(a.id)}"><strong>${esc(codeIdentity(codesFor(a)))}</strong><span>${QT('ovAssignment','Coding ID')}: <code>${esc(a.id)}</code> · ${QT('ovCodeId','Code ID')}: <code>${esc(a.code_id)}</code></span></li>`).join('')}</ul>${button}</section>`:''}<p class="overview-note">${QT('ovUnits','A source range is one original [start, end) pair in this document. Multiple codes can share it. Per-paragraph touching counts must not be summed. A continuous stroke is only a visual union, not a co-occurrence claim.')}</p><p class="overview-note">${QT('ovMemory','Preview and jumps do not mark reading or replace Resume. Choose Keep this reading position to update browser memory.')}</p>`;
}
function renderReadingOverview(){
  const panel=$('#reading-overview');if(!panel)return;
  const opened=[...panel.querySelectorAll('details[open]')].map(el=>el.id),active=document.activeElement?.closest?.('#reading-overview')?document.activeElement:null,activeId=active?.id,action=active?.dataset?.action,key=active?.dataset?.key,index=active?.dataset?.index,kind=active?.dataset?.kind,direction=active?.dataset?.direction;
  panel.hidden=!readingOverview.open;panel.innerHTML=readingOverviewHtml();
  for(const id of opened){const element=document.getElementById(id);if(element)element.open=true;}
  if(active){const replacement=(activeId&&document.getElementById(activeId))||[...panel.querySelectorAll('[data-action]')].find(el=>el.dataset.action===action&&el.dataset.key===key&&el.dataset.index===index&&el.dataset.kind===kind&&el.dataset.direction===direction);if(replacement?.disabled&&kind){panel.querySelector(`[data-action="overview-page"][data-kind="${kind}"]:not(:disabled)`)?.focus({preventScroll:true});}else replacement?.focus({preventScroll:true});}
  updateReadingOverviewPosition();
}
function updateReadingOverviewPosition(){
  const line=$('#overview-current-line'),label=$('#overview-current-label');if(!line||!doc()||!readingMounted)return;
  const length=cp(doc().text).length,start=readingMounted.start;
  line.hidden=start===null;line.setAttribute('visibility',start===null?'hidden':'visible');line.setAttribute('x1',length?start/length*1000:0);line.setAttribute('x2',length?start/length*1000:0);
  if(label){const p=readingMounted.paragraph;label.textContent=!p?QT('readingNoMatch','No matching paragraph'):`${QT('ovCurrent','Current position')}: ¶${p.index+1} [${p.start}, ${p.end})`;}
}
function toggleReadingOverview(force){
  const o=ensureReadingOverview(),open=force??!o.open;
  const current=readingParagraph(),box=current?.getBoundingClientRect(),visible=box&&box.top<Math.min(window.innerHeight,$('#document-pane')?.getBoundingClientRect().bottom||window.innerHeight);
  if(open&&!o.open){captureReadingPosition();o.returnStart=readingMounted?.start;o.paragraph=Math.max(0,segments(doc().text).findIndex(p=>p.start===o.returnStart));o.paragraphPage=Math.floor(o.paragraph/12);}
  o.open=open;const button=$('[data-action="reading-overview"]');button?.setAttribute('aria-expanded',String(open));renderReadingOverview();
  if(open){const pane=$('#document-pane');if(getComputedStyle(pane).overflowY==='auto')pane.scrollTop=0;else $('#reading-overview').scrollIntoView({block:'start',behavior:'instant'});}
  else{scrollReadingParagraph(visible?Number(current.dataset.start):overviewPreviewNavigation()?readingOverviewNav.start:o.returnStart);updateReadingPosition();button?.focus({preventScroll:true});}
}
function selectReadingOverviewParagraph(index){
  const o=ensureReadingOverview(),paragraphs=segments(doc().text);if(!Number.isInteger(index)||index<0||index>=paragraphs.length)return;
  o.paragraph=index;o.paragraphPage=Math.floor(index/12);o.rangeKey=null;o.sourcePage=0;renderReadingOverview();
}
function jumpReadingOverview(full=false){
  const o=ensureReadingOverview(),data=readingOverviewData(state.project,doc()),group=data.ranges.find(g=>g.key===o.rangeKey),p=data.paragraphs[o.paragraph];if(!p)return;
  const range=group||p,shown=new Set([...document.querySelectorAll('#reader .paragraph')].map(el=>Number(el.dataset.start))),touching=data.paragraphs.filter(row=>row.start<range.end&&row.end>range.start),visible=touching.length>0&&touching.every(row=>shown.has(row.start));
  if((state.search||state.codeFilter)&&!visible&&!full)return;
  if(!readingOverviewNav)captureReadingPosition();
  const first=data.paragraphs.find(row=>row.start<range.end&&row.end>range.start);if(!first)return;
  readingOverviewNav={key:o.key,start:first.start,focusPending:true};readingOverviewFocus=group?{key:o.key,start:group.start,end:group.end,ids:group.annotations.map(a=>a.id)}:null;
  if(full){state.search='';state.codeFilter=null;}
  state.sourceFocus=null;state.selection=null;render();
  focusReadingOverviewSource();announceMark(QT('ovJumped','Source preview. Resume returns to the saved position.'));
}
function focusReadingOverviewSource(){
  if(!overviewPreviewNavigation()||state.sourceFocus||!readingOverviewNav.focusPending)return;
  scrollReadingParagraph(readingOverviewNav.start,true);
  if(readingOverviewFocus){const target=document.querySelector('.overview-source-target');if(target){for(let pass=0;pass<2;pass++){const pane=$('#document-pane'),scroller=readingScrollContainer(),tools=$('.document-tools'),top=Math.max($('.reading-dock').getBoundingClientRect().bottom,pane.getBoundingClientRect().top,getComputedStyle(tools).position==='sticky'?tools.getBoundingClientRect().bottom:0),delta=target.getBoundingClientRect().top-top;if(scroller)scroller.scrollTop+=delta;else window.scrollBy({top:delta,behavior:'instant'});}target.focus({preventScroll:true});}previewCoding(readingOverviewFocus.ids);}
  readingOverviewNav.focusPending=false;
  updateReadingPosition();
}
function keepOverviewPosition(){
  const start=overviewPreviewNavigation()?readingOverviewNav.start:readingMounted?.start;readingSearchReturn=null;readingOverviewNav=null;readingOverviewFocus=null;readingOverview.open=false;renderReadingOverview();$('#reader').innerHTML=readerHtml();previewCoding();$('[data-action="reading-overview"]')?.setAttribute('aria-expanded','false');scrollReadingParagraph(start,true);updateReadingPosition();
  const kept=writeReadingPosition(state.project,doc(),start),message=QT(kept?'ovPositionSaved':'ovStorageUnavailable',kept?'Browser reading position saved.':'Browser storage is unavailable; this position cannot be remembered.');
  announceMark(message);toast(message,!kept);
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&readingOverview.open&&(e.target.closest?.('#reading-overview')||e.target.closest?.('[data-action="reading-overview"]'))){e.preventDefault();toggleReadingOverview(false);}});
document.addEventListener('click',e=>{const map=e.target.closest?.('#reading-overview-map');if(!map)return;const box=map.getBoundingClientRect(),data=readingOverviewData(state.project,doc()),offset=Math.max(0,Math.min(data.length,(e.clientX-box.left)/Math.max(1,box.width)*data.length));selectReadingOverviewParagraph(overviewParagraphAt(data.paragraphs,offset));});
document.addEventListener('change',e=>{if(e.target.id==='overview-source-scope'){readingOverview.sourceScope=e.target.value;readingOverview.sourcePage=0;renderReadingOverview();}});

let readingMounted=null,readingFrame=0,readingSearchReturn=null;
function readingScrollContainer(){
 let element=$('#document-pane');
 while(element&&element!==document.body&&element!==document.documentElement){
  if(['auto','scroll'].includes(getComputedStyle(element).overflowY)&&element.scrollHeight>element.clientHeight+1)return element;
  element=element.parentElement;
 }
 return null;
}
function readingViewportTop() {
  const pane=$('#document-pane'),dock=$('.reading-dock');if(!pane||!dock)return null;
  const tools=$('.document-tools'),toolsBottom=tools&&getComputedStyle(tools).position==='sticky'?tools.getBoundingClientRect().bottom:0;
  return Math.max(dock.getBoundingClientRect().bottom,pane.getBoundingClientRect().top,toolsBottom);
}
function readingParagraph() {
  const top=readingViewportTop();if(top===null)return null;
  const paragraphs=[...document.querySelectorAll('#reader .paragraph')];
  return paragraphs.find(p=>p.getBoundingClientRect().bottom>top+2)||paragraphs.at(-1)||null;
}
function readingSearchPosition(project=state.project,d=doc()) {
  const saved=readingSearchReturn;
  return saved&&project&&d&&saved.key===markKey(project.id,d.id)&&saved.text===d.text&&segments(d.text).some(p=>p.start===saved.start)?saved:null;
}
function beginReadingSearch() {
  const d=doc();if(!readingMounted||!d||readingMounted.projectId!==state.project?.id||readingMounted.document.id!==d.id)return;
  if(readingSearchPosition())return;
  let start=readingMounted.readingStart??readReadingPosition(state.project,d)?.start??readingMounted.start;
  const paragraph=readingParagraph(),box=paragraph?.getBoundingClientRect(),top=readingViewportTop();
  if(!readingMounted.filtered&&box&&top!==null&&box.top<=top+2&&box.bottom>top+2)start=Number(paragraph.dataset.start);
  if(!segments(d.text).some(p=>p.start===start))return;
  // Keep the source-bound return only in memory. It is also usable when browser
  // storage is blocked; no project record or exported field is introduced.
  readingSearchReturn={key:markKey(state.project.id,d.id),text:d.text,start};
  writeReadingPosition(state.project,d,start);
}
function readingSearchGesture(event) {
  // A compositor scroll can retarget wheel/touch events to metadata now under
  // the pointer. It is still an intentional scroll of the source pane.
  const region=['wheel','touchmove','touchend'].includes(event.type)?'#document-pane':'#reader';
  if(!readingMounted||readingMounted.filtered||!event.target.closest?.(region)||event.target.closest('button,input,textarea,select,.document-tools,#reading-overview'))return;
  if((event.type==='keydown'||event.type==='keyup')&&(!['Home','End','PageUp','PageDown','ArrowUp','ArrowDown',' '].includes(event.key)||event.target.isContentEditable))return;
  cancelReadingWindow();
  if(document.activeElement?.id==='search')document.activeElement.blur();
  readingSearchReturn=null;const mounted=readingMounted;
  const sample=()=>{
    if(readingMounted!==mounted||mounted.projectId!==state.project?.id||mounted.document.id!==doc()?.id||mounted.document.text!==doc()?.text||mounted.filtered||state.search||state.codeFilter||readingSearchPosition()||document.activeElement?.id==='search')return;
    mounted.readingScroll=true;updateReadingPosition();
  };
  sample();requestAnimationFrame(sample);
}
function scheduleSearchReadingRestore(start) {
  const mounted=readingMounted;
  requestAnimationFrame(()=>{
    if(readingMounted!==mounted||mounted.projectId!==state.project?.id||mounted.document.id!==doc()?.id||mounted.document.text!==doc()?.text||state.search||state.codeFilter||state.sourceFocus||readingOverview.open||overviewPreviewNavigation()||document.activeElement?.id!=='search')return;
    scrollReadingParagraph(start);updateReadingPosition();
  });
}
document.addEventListener('focusin',event=>{if(event.target.id==='search'||event.target.closest?.('[data-action="coding-codebook"]'))beginReadingSearch();});
document.addEventListener('pointerdown',readingSearchGesture);
document.addEventListener('wheel',readingSearchGesture,{passive:true});
document.addEventListener('touchmove',readingSearchGesture,{passive:true});
document.addEventListener('touchend',readingSearchGesture,{passive:true});
document.addEventListener('keydown',readingSearchGesture);
document.addEventListener('keyup',readingSearchGesture);
// Source-bound window recovery is ephemeral. It never marks a paragraph as read.
let readingWindowRestore=null,readingWindowFrame=0,readingWindowTimer=0;
let readingWindowSize={width:window.innerWidth,height:window.innerHeight};
function readingWindowChanging(){
 if(validReadingWindow(readingWindowRestore))return true;
 if(readingMounted&&((Number.isFinite(readingWindowSize.width)&&window.innerWidth!==readingWindowSize.width)||(Number.isFinite(readingWindowSize.height)&&window.innerHeight!==readingWindowSize.height))){rememberReadingWindow();return true;}
 return false;
}
function validReadingWindow(saved){
 const d=doc();return !!(saved&&d&&state.view==='coding'&&state.project?.id===saved.projectId&&d.id===saved.documentId&&d.text===saved.text&&readingMounted===saved.mounted&&segments(d.text).some(p=>p.start===saved.start));
}
function rememberReadingWindow(){
 if(validReadingWindow(readingWindowRestore))return readingWindowRestore;
 if(readingWindowRestore)cancelReadingWindow();
 const d=doc(),m=readingMounted;if(!d||!m||state.view!=='coding'||m.projectId!==state.project?.id||m.document.id!==d.id||m.document.text!==d.text)return null;
 let start=m.start;
 if($('#code-popup')&&state.selection?.document_id===d.id){const p=segments(d.text).find(p=>p.start<=state.selection.start&&state.selection.start<p.end);if(p)start=p.start;}
 if(!Number.isInteger(start)||!segments(d.text).some(p=>p.start===start))return null;
 readingWindowRestore={projectId:state.project.id,documentId:d.id,text:d.text,mounted:m,start,
  restore:!readingOverview.open&&!document.activeElement?.closest?.('.reading-details, #reading-overview, .document-tools')};
 return readingWindowRestore;
}
function cancelReadingWindow(){
 if(readingWindowFrame&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(readingWindowFrame);
 if(readingWindowTimer)clearTimeout(readingWindowTimer);
 readingWindowFrame=0;readingWindowTimer=0;readingWindowRestore=null;readingWindowSize={width:window.innerWidth,height:window.innerHeight};
}
function finishReadingWindow(saved){
 if(saved!==readingWindowRestore)return;
 if(!validReadingWindow(saved)){cancelReadingWindow();return;}
 if(document.visibilityState==='hidden')return;
 if(saved.restore)scrollReadingParagraph(saved.start);
 cancelReadingWindow();readingWindowSize={width:window.innerWidth,height:window.innerHeight};
 if(saved.restore)updateReadingPosition();
 positionCodePopup();
}
function restoreReadingWindow(){
 const saved=rememberReadingWindow();if(!saved||document.visibilityState==='hidden')return;
 if(readingWindowFrame&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(readingWindowFrame);
 if(readingWindowTimer)clearTimeout(readingWindowTimer);
 readingWindowFrame=requestAnimationFrame(()=>{
  readingWindowFrame=0;if(!validReadingWindow(saved))return;
  if(saved.restore)scrollReadingParagraph(saved.start);positionCodePopup();
 });
 // Keep the first anchor through a resize burst and settle after sticky reflow.
 readingWindowTimer=setTimeout(()=>finishReadingWindow(saved),150);
}
function onCodingWindowResize(){
 rememberReadingWindow();const wide=inspectorWide();
 if(wide!==inspectorWasWide){inspectorWasWide=wide;if(state.project&&state.view==='coding')syncCodingInspectorLayout(wide);}
 restoreReadingWindow();positionCodePopup();
}
function captureReadingPosition() {
  if(readingWindowChanging())return;
  if(inspectorReturn()||!readingMounted||readingMounted.filtered||readingOverview.open||overviewPreviewNavigation()||document.activeElement?.id==='search'||readingSearchPosition({id:readingMounted.projectId},readingMounted.document))return;
  const paragraph=readingParagraph();if(!paragraph)return;
  writeReadingPosition({id:readingMounted.projectId},readingMounted.document,Number(paragraph.dataset.start));
}
function updateReadingPath() {
  const target=$('#reading-code-path');if(!target||!readingMounted)return;
  const paths=codingReadingPaths(readingMounted.start,codingPreview.length?codingPreview:(state.sourceFocus?[state.sourceFocus]:[]));
  target.textContent=paths.join('\n')||QT('readingNoCoding','No saved coding at this position');
  const label=$('#reading-path-label');if(label)label.textContent=QT(state.codeFilter?'readingFilter':codingPreview.length||state.sourceFocus?'readingFocused':'readingHere',state.codeFilter?'Filter':codingPreview.length||state.sourceFocus?'Focused coding':'Codings here');
}
function updateReadingPosition() {
  if(readingWindowChanging())return;
  if(!readingMounted||!$('#reading-document'))return;
  const paragraph=readingParagraph(),box=paragraph?.getBoundingClientRect(),pane=$('#document-pane')?.getBoundingClientRect();
  const inView=box&&box.top<Math.min(window.innerHeight,pane?.bottom||window.innerHeight);
  const start=readingOverview.open&&!inView?readingMounted.start:paragraph?Number(paragraph.dataset.start):null;
  const all=segments(doc().text),index=all.findIndex(p=>p.start===start),output=$('#reading-position');
  readingMounted.start=start;readingMounted.paragraph=all[index]||null;
  // A browser can scroll to a search input before delivering its focus event.
  // Remember the last actual reading line separately from that viewport move.
  if(!readingMounted.filtered&&!readingSearchPosition()&&document.activeElement?.id!=='search'&&Number.isInteger(start)&&(readingMounted.readingStart==null||readingMounted.readingScroll||(inView&&box.top<=readingViewportTop()+2)))readingMounted.readingStart=start;
  readingMounted.readingScroll=false;
  // Revealing an overview control can expose the first source paragraph below
  // the reading line. Only actual reading at that line advances the Keep anchor.
  if(overviewPreviewNavigation()&&inView&&box.top<=readingViewportTop()+2&&Number.isInteger(start))readingOverviewNav.start=start;
  if(output)output.textContent=index<0?QT('readingNoMatch','No matching paragraph'):`${QT('readingParagraph','Paragraph')} ${index+1} / ${all.length}`;
  captureReadingPosition();updateReadingPath();
  updateProjectMarks();updateReadingOverviewPosition();
  const resume=$('[data-action="reading-resume"]');if(resume)resume.disabled=!readReadingPosition(state.project,doc());
}
function scrollReadingParagraph(start,focus=false) {
  const paragraph=[...document.querySelectorAll('#reader .paragraph')].find(p=>Number(p.dataset.start)===start),pane=$('#document-pane'),dock=$('.reading-dock'),scroller=readingScrollContainer();
  if(!paragraph||!pane||!dock)return;
  // A phone's dock enters sticky positioning during the first movement.
  // Re-measure once so restoration aligns with its final viewport position.
  for(let pass=0;pass<2;pass++) {
    const tools=$('.document-tools'),toolsBottom=tools&&getComputedStyle(tools).position==='sticky'?tools.getBoundingClientRect().bottom:0;
    const top=Math.max(dock.getBoundingClientRect().bottom,pane.getBoundingClientRect().top,toolsBottom),delta=paragraph.getBoundingClientRect().top-top;
    if(scroller)scroller.scrollTop+=delta;else window.scrollBy({top:delta,behavior:'instant'});
  }
  if(focus){paragraph.tabIndex=-1;paragraph.focus({preventScroll:true});}
}
function mountReading(restore=true) {
  readingWindowSize={width:window.innerWidth,height:window.innerHeight};
  readingMounted=null;codingPreview=[];
  readingMarkTarget=null;readingFocusedStart=null;
  if(state.view!=='coding'||!doc()||!$('#reading-document'))return;
  readingMounted={projectId:state.project.id,document:doc(),filtered:!!(state.search||state.codeFilter),start:null};
  const search=readingSearchPosition();if(readingSearchReturn&&!search)readingSearchReturn=null;
  const saved=search||readReadingPosition(state.project,doc());readingMounted.readingStart=saved?.start??null;
  if(restore&&!state.sourceFocus&&overviewPreviewNavigation()){scrollReadingParagraph(readingOverviewNav.start);}
  else if(restore&&!readingMounted.filtered&&!state.sourceFocus){
    if(saved)scrollReadingParagraph(saved.start);else if(window.innerWidth<=800)window.scrollTo({top:0,behavior:'instant'});
  }
  updateReadingPosition();
  if(readingOverview.open)renderReadingOverview();
  if(overviewPreviewNavigation())focusReadingOverviewSource();
  if(restore&&!readingMounted.filtered&&search&&!state.sourceFocus&&!overviewPreviewNavigation()){
    // Native input handling can reveal the caret after this synchronous mount.
    // Restore once more after that handling, unless navigation has moved on.
    if(document.activeElement?.id==='search')scheduleSearchReadingRestore(search.start);
    readingSearchReturn=null;
  }
}
function scheduleReadingPosition(event) {
  if(event&&event.type==='scroll'&&event.target!==document&&event.target!==$('#document-pane')&&event.target!==readingScrollContainer())return;
  if(readingFrame||!readingMounted)return;
  readingFrame=requestAnimationFrame(()=>{readingFrame=0;updateReadingPosition();});
}
function switchReadingDocument(id) {
  if(!state.project.documents.some(d=>d.id===id))return;
  state.sourceFocus=null;state.networkReturn=null;state.docId=id;state.selection=null;state.search='';state.codeFilter=null;state.view='coding';render();
  $('#reading-document')?.focus({preventScroll:true});
  const announcement=$('#reading-announcement');if(announcement)announcement.textContent=`${doc().name} · ${$('#reading-position').textContent}`;
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
function codebookHtml(context='side') {
  const inspect=context==='inspector';
  const p=state.project;
  if(!p.codes.length)return `<div class="empty">${QT('noCodes','No codes yet. Add one to start coding.')}</div>`;
  const {own,total}=codeCounts(),byParent=new Map(),needle=(inspect?codingInspector.query:state.sideFilter).trim().toLowerCase();
  p.codes.forEach(c=>{const key=c.parent_id||null;if(!byParent.has(key))byParent.set(key,[]);byParent.get(key).push(c);});
  byParent.forEach(list=>list.sort((a,b)=>(a.order??0)-(b.order??0)||a.name.localeCompare(b.name)));
  const row=(c,search=false)=>{
    const children=byParent.get(c.id)||[],open=!state.collapsed.has(c.id),path=codeIdentity(c),role=inspect?inspectorRole(c):codeRole(c);
    return `<li data-code-node="${c.id}" data-parent-id="${esc(c.parent_id||'')}"><div class="code-row">
      ${children.length&&!search?`<button class="twisty" data-action="toggle-code" data-id="${c.id}" aria-expanded="${open}" aria-controls="cb-${context}-${c.id}" aria-label="${esc((open?QT('collapse','Collapse'):QT('expand','Expand'))+' '+c.name)}">${open?'▾':'▸'}</button>`:'<span class="twisty leaf" aria-hidden="true">·</span>'}
      <button class="side-item${(inspect?codingInspector.codeId===c.id:state.codeFilter===c.id)?' selected':''}" data-action="${inspect?'inspect-code':'filter-code'}" data-id="${c.id}" aria-pressed="${inspect?codingInspector.codeId===c.id:state.codeFilter===c.id}" aria-label="${esc(role+': '+path+' · '+(total.get(c.id)||0)+' '+QT('savedCodings'))}" title="${esc(path+(c.definition?' — '+c.definition:''))}">
        <span class="code-row-label"><span class="code-role">${esc(role)}</span><span class="name">${esc(c.name)}${!inspect&&c.status!=='final'?`<span class="status-flag">${esc(c.status)}</span>`:''}</span>${search?`<small class="code-parent">${esc(path)}</small>`:path!==codePath(c)?`<small class="code-identity-id">${esc(c.id)}</small>`:''}</span>
        <span class="count" title="${own.get(c.id)||0} direct · ${total.get(c.id)||0} including sub-codes">${total.get(c.id)||0}</span><span class="code-color-swatch" style="background:${esc(c.color)}" aria-hidden="true"></span>
      </button><button class="edit-code" data-action="code-edit" data-id="${c.id}"${demoLock('Edit, re-parent, merge or delete')} aria-label="${esc(QT('editCode','Edit code')+': '+path)}">⋯</button>
    </div>${children.length&&!search?`<ul id="cb-${context}-${c.id}"${open?'':' hidden'}>${children.map(child=>row(child)).join('')}</ul>`:''}</li>`;
  };
  const hits=needle?p.codes.filter(c=>`${c.name} ${c.definition||''}`.toLowerCase().includes(needle)):byParent.get(null)||[];
  return `<p class="codebook-key">${QT('codebookHint')}</p>${needle?`<div class="side-hits">${QT('codeHits','Codes matching')} ${hits.length} / ${p.codes.length}</div>`:''}<ul class="codebook-tree" aria-label="${QT('codebookTree')}">${hits.map(c=>row(c,!!needle)).join('')}</ul>${hits.length?'':`<div class="empty">${QT('noCodesFilter','No codes to show.')}</div>`}`;
}
function refreshCodebooks(id,part='filter-code',context='side') {
  const scroller=$('.sidebar-scroll'),top=scroller?.scrollTop;
  refreshSideList();if(scroller)scroller.scrollTop=top;
  const mobile=$('#mobile-codebook-list');if(mobile)mobile.innerHTML=codebookHtml('mobile');
  const inspector=$('#inspector-tree');if(inspector)inspector.innerHTML=codebookHtml('inspector');
  const host=context==='inspector'?inspector:context==='mobile'?mobile:$('#side-list');
  [...host?.querySelectorAll(`[data-action="${part}"]`)||[]].find(el=>el.dataset.id===id)?.focus({preventScroll:true});
  previewCoding(codingPreview);
}
function handleCodebookKey(event) {
  if(event.altKey||event.ctrlKey||event.metaKey)return;
  const button=event.target.closest('.codebook-tree [data-action="filter-code"],.codebook-tree [data-action="inspect-code"],.codebook-tree [data-action="toggle-code"]');if(!button)return;
  const tree=button.closest('.codebook-tree'),id=button.dataset.id,code=state.project.codes.find(c=>c.id===id),context=tree.closest('#inspector-tree')?'inspector':tree.closest('#mobile-codebook-list')?'mobile':'side';
  const selectedAction=context==='inspector'?'inspect-code':'filter-code';
  const visible=[...tree.querySelectorAll(`[data-action="${selectedAction}"]`)].filter(el=>el.getClientRects().length),index=visible.findIndex(el=>el.dataset.id===id),children=state.project.codes.filter(c=>c.parent_id===id);
  let next;
  if(event.key==='ArrowDown')next=visible[Math.min(index+1,visible.length-1)];else if(event.key==='ArrowUp')next=visible[Math.max(0,index-1)];else if(event.key==='Home')next=visible[0];else if(event.key==='End')next=visible.at(-1);
  else if(event.key==='ArrowRight'){
    if(children.length&&state.collapsed.has(id)){event.preventDefault();state.collapsed.delete(id);refreshCodebooks(id,selectedAction,context);return;}
    next=visible.find(el=>el.closest('[data-code-node]').dataset.parentId===id);
  }else if(event.key==='ArrowLeft'){
    if(children.length&&!state.collapsed.has(id)){event.preventDefault();state.collapsed.add(id);refreshCodebooks(id,selectedAction,context);return;}
    next=visible.find(el=>el.dataset.id===code.parent_id);
  }else return;
  event.preventDefault();next?.focus();next?.scrollIntoView({block:'nearest'});
}
function showMobileCodebook() {beginReadingSearch();openCodingInspector(false);}
// The sidebar's own scroll, re-rendered on every keystroke in the filter box.
// Redrawing the whole app would take the caret out of the input.
function refreshSideList(){const el=$('#side-list');if(el)el.innerHTML=sideListHtml();}
// UX81: one document manager, opened on demand; removal always has its own review.
let documentManager=null;
const dmText=(en,zh)=>QT_LANG==='zh'?zh:en;
function managedDocuments(){
 const query=(documentManager?.query||'').trim().toLocaleLowerCase();
 return state.project.documents.map((d,index)=>({d,index})).reverse().filter(({d})=>!query||d.name.toLocaleLowerCase().includes(query));
}
function managedDocumentRows(){
 const p=state.project,rows=managedDocuments();
 return rows.map(({d,index})=>{
  const n=p.annotations.filter(a=>a.document_id===d.id).length,s=p.suggestions.filter(a=>a.document_id===d.id).length;
  const when=d.created_at?new Date(d.created_at):null,date=when&&!Number.isNaN(when.valueOf())?when.toLocaleString(QT_LANG==='zh'?'zh-CN':'en-GB'):dmText('Date unavailable','日期未记录');
  return `<li class="managed-document"><div><h3>${esc(d.name)}</h3><p>${esc(date)} · ${cp(d.text).length.toLocaleString()} ${dmText('characters','字符')} · ${n} ${dmText('codings','编码标注')}${s?` · ${s} ${dmText('suggestions','建议')}`:''}</p><small>${dmText('Document','文档')} ${index+1} · ID ${esc(d.id)}</small></div><div class="managed-actions"><button data-action="document-view" data-id="${esc(d.id)}">${dmText('View','查看')}</button><button data-action="document-remove-review" data-id="${esc(d.id)}"${demoLock()}>${dmText('Remove…','移除…')}</button></div></li>`;
 }).join('')||`<li class="empty">${dmText('No matching documents.','没有匹配的文档。')}</li>`;
}
function installManagedProject(project){
 const removed=state.docId&&!project.documents.some(d=>d.id===state.docId);
 state.project=project;
 if(removed){state.docId=project.documents[0]?.id||null;state.search='';state.codeFilter=null;state.selection=null;state.sourceFocus=null;state.networkReturn=null;resetCodingInspector();readingOverview={key:null,open:false};readingOverviewNav=null;readingOverviewFocus=null;}
}
async function showDocumentManager(opener=null){
 if(!state.project)return;
 captureReadingPosition();
 const session=documentManager={projectId:state.project.id,query:'',opener:opener||documentManager?.opener,busy:false,loading:true,review:null};
 modal(dmText('Manage documents','管理文档'),`<p role="status">${dmText('Loading saved documents…','正在读取已保存文档…')}</p>`);$('#dialog').dataset.workflow='documents';
 try{
  await codingSaveQueue;
  const project=await api(`/api/projects/${session.projectId}`);
  if(!documentManagerActive(session))return;
  installManagedProject(project);render();renderDocumentManager();
 }finally{session.loading=false;}
}
function renderDocumentManager(){
 modal(dmText('Manage documents','管理文档'),`<p>${dmText('Find an import by name. Most recently added first. View the source before deciding to remove it.','按名称查找，最近加入的文档在前。移除前可先查看原文。')}</p><label class="field">${dmText('Find a document','查找文档')}<input id="manage-document-search" type="search" value="${esc(documentManager.query)}" autocomplete="off"></label><ul class="managed-documents" id="managed-document-list">${managedDocumentRows()}</ul>`,`<button data-action="document-recovery">${dmText('Recovery points','恢复点')}</button><button data-action="documents-done">← ${dmText('Continue coding','继续编码')}</button>`);
 $('#dialog').dataset.workflow='documents';$('#manage-document-search').focus({preventScroll:true});
}
function documentManagerActive(session){return documentManager===session&&$('#dialog').open&&$('#dialog').dataset.workflow==='documents'&&state.project?.id===session.projectId;}
function finishDocumentManager(){
 if(documentManager?.busy)return;
 const opener=documentManager?.opener;closeModal();documentManager=null;
 const target=opener?.isConnected?opener:[...document.querySelectorAll('[data-action="documents"]')].find(e=>e.getClientRects().length);
 target?.focus({preventScroll:true});
}
async function reviewDocumentRemoval(id){
 const session=documentManager;if(!session||session.busy||session.loading||!documentManagerActive(session))return;
 session.busy=true;
 try{
  const info=await api(`/api/projects/${session.projectId}/document-removal?id=${encodeURIComponent(id)}`);
  if(!documentManagerActive(session))return;
  session.review=info;
  const blocked=info.blocked||info.analysis_running;
  modal(dmText('Remove this document?','移除此文档？'),`<div class="document-removal-review"><h3>${esc(info.document.name)}</h3><small>ID ${esc(info.document.id)}</small><p>${info.characters.toLocaleString()} ${dmText('characters','字符')} · ${info.codings} ${dmText('codings','编码标注')} · ${info.suggestions} ${dmText('suggestions','建议')} · ${info.reading_marks} ${dmText('reading marks','阅读标记')}</p><p>${dmText('This removes the source, its codings, suggestions and reading notes from this project. The code tree and other documents stay.','将从当前项目移除此文档及其标注、建议和阅读笔记。编码树及其他文档保留。')}</p>${info.has_frozen_results?`<p>${dmText('Frozen reports and QCA results keep their original evidence and become out of date. Recovery points and the audit trail also remain. This is not permanent erasure of all copies.','冻结报告和QCA结果保留原证据，并标记为过期。恢复点及审计记录也保留；这不是清除所有副本。')}</p>`:`<p>${dmText('Recovery points and the audit trail remain. This is not permanent erasure of all copies.','恢复点及审计记录保留；这不是清除所有副本。')}</p>`}<p>${dmText('An exact recovery point is checked before removal. Restore it as a separate project from Manage documents → Recovery points.','移除前会核验完整恢复点，可从“管理文档 → 恢复点”恢复为独立项目。')}</p>${blocked?`<p class="inline-error" role="status">${info.analysis_running?dmText('An analysis is running. Stop it and wait for completion before removing a document.','分析正在运行，请停止并等待完成后再移除。'):dmText('Current Comparative QCA cases use this document. Update their mapping and calibration first in Export → Research report → Comparative QCA.','当前Comparative QCA案例使用此文档，请先在导出 → 研究报告 → Comparative QCA中更新映射与校准。')} ${esc((info.qca_cases||[]).join(', '))}</p>`:`<label class="document-remove-check"><input id="document-remove-confirm" type="checkbox">${dmText('I checked the document name and the records that will be removed.','我已核对文档名称及将移除的记录。')}</label>`}</div><p id="document-remove-status" role="status"></p>`,`<button data-action="document-remove-cancel">${dmText('Cancel — keep document','取消，保留文档')}</button><button data-action="document-remove-confirm" class="danger" disabled>${dmText('Remove document','移除文档')}</button>`);
  $('#dialog').dataset.workflow='documents';$('[data-action="document-remove-cancel"]').focus({preventScroll:true});
 }finally{session.busy=false;}
}
function syncRemovalConfirm(){const b=$('[data-action="document-remove-confirm"]');if(b)b.disabled=!!documentManager?.busy||!$('#document-remove-confirm')?.checked||!documentManager?.review||documentManager.review.blocked||documentManager.review.analysis_running;}
async function confirmDocumentRemoval(){
 const session=documentManager;if(!session||session.busy||!documentManagerActive(session)||!$('#document-remove-confirm')?.checked||!session.review||session.review.blocked||session.review.analysis_running)return;
 session.busy=true;syncRemovalConfirm();$('#document-remove-status').textContent=dmText('Checking recovery point and removing…','正在核验恢复点并移除…');
 for(const b of document.querySelectorAll('#dialog button'))b.disabled=true;
 try{
  await codingSaveQueue;
  const id=session.review.document.id;
  await api(`/api/projects/${session.projectId}/document-delete`,{id,confirmation:session.review.confirmation});
  if(state.project?.id!==session.projectId)return;
  // Read the committed state; do not retry the destructive request after a lost reply.
  const [project,projects,backups]=await Promise.all([api(`/api/projects/${session.projectId}`),api('/api/projects'),api(`/api/projects/${session.projectId}/backups`)]);
  installManagedProject(project);state.projects=projects;state.backups=backups.items;state.backupStatus=backups.status;
  session.review=null;render();renderDocumentManager();toast(dmText('Document removed. Recovery points retained.','文档已移除，恢复点保留。'));
 }catch(error){
  // The commit may have succeeded even if its response or the refresh was lost.
  // Require re-review; a retry cannot silently reuse the previous approval.
  session.review=null;$('#document-remove-status').textContent=dmText('Removal was not confirmed. Reopen Manage documents to check saved state before trying again.','尚未确认移除结果，请重新打开文档管理检查已保存状态后再操作。');throw error;
 }finally{session.busy=false;for(const b of document.querySelectorAll('#dialog button'))b.disabled=false;syncRemovalConfirm();}
}

function sideListHtml() {
  const p=state.project;
  const needle=state.sideFilter.trim().toLowerCase();
  const docs=needle?p.documents.filter(d=>d.name.toLowerCase().includes(needle)):p.documents;
  const total=p.codes.length;
  const open=state.codebookOpen||!!needle;
  return `<div class="side-title"><div class="section-label">${QT('documents','DOCUMENTS')} <span class="count">${docs.length}${docs.length!==p.documents.length?`/${p.documents.length}`:''}</span></div><button class="link" data-action="import"${demoLock()} aria-label="${QT('importDlg','Import interview')}">＋</button></div>
    ${docs.map(d=>`<button class="side-item ${d.id===state.docId?'selected':''}" data-action="doc" data-id="${d.id}" title="${esc(d.name)}">${icon('doc')}<span class="name">${esc(d.name)}</span></button>`).join('') || `<div class="empty">${QT('noDocsFilter','No documents match.')}</div>`}
    ${state.view==='coding'?'':`<div class="side-title"><button class="side-toggle" data-action="toggle-codebook" aria-expanded="${open}"><span class="twisty">${open?'▾':'▸'}</span>${QT('codebookTree')} <span class="count">${total}</span>${total?`<span class="side-hint">${open?QT('codebookHide','hide codes'):QT('codebookShow','show codes')}</span>`:''}</button><button class="link" data-action="code"${demoLock()} aria-label="${QT('createCode','Create code')}">＋</button></div>
    ${open?codebookHtml():''}`}`;
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
// UX-26: startup and guide preferences are browser-only navigation, never research data.
function workspaceMemoryKey() { return 'qt.workspace.v1:'+QT_BASE; }
function rememberWorkspaceProject(id) {
  try{localStorage.setItem(workspaceMemoryKey(),JSON.stringify({version:1,projectId:id}));}catch(_){}
}
function selectedStartupProject(projects,publicDemo=false,hosted=false) {
  // Hosted sign-ins and public visits always start with an explicit project choice.
  if(publicDemo||hosted)return null;
  try{const saved=JSON.parse(localStorage.getItem(workspaceMemoryKey()));if(saved?.version===1&&typeof saved.projectId==='string'&&projects.some(p=>p.id===saved.projectId))return saved.projectId;}catch(_){}
  return null;
}
function isBolognaExample(project) { return project.id==='a71a0b538c024c3ab23fb4286cfe93e2'||project.audit?.some(e=>e.action==='example_copy'&&e.example==='bologna')||false; }
const guideFallback=new Map();
let guide={open:false,step:null},guideReturnFocus=null,startReturnFocus=null;
function guideMemoryKey(id) { return 'qt.guide.v1:'+JSON.stringify([QT_BASE,id]); }
function guidePreference(id) {
  let saved;
  try{const raw=localStorage.getItem(guideMemoryKey(id));saved=raw===null?guideFallback.get(id):JSON.parse(raw);}catch(_){saved=guideFallback.get(id);}
  return saved?.version===1&&['active','dismissed'].includes(saved.status)&&(saved.step===null||Number.isInteger(saved.step)&&saved.step>=0&&saved.step<3)?saved:null;
}
function setGuidePreference(id,status,step=null) {
  const saved={version:1,status,step};
  try{localStorage.setItem(guideMemoryKey(id),JSON.stringify(saved));guideFallback.delete(id);}catch(_){guideFallback.set(id,saved);}
}
function guideCurrentStep(project) { return !project?.documents.length?0:!project.annotations.length?1:2; }
function quickGuideHtml() {
  if(!guide.open)return '';
  const step=guide.step??guideCurrentStep(state.project),readonly=state.config.public_demo;
  const titles=[QT('guideImport','Import one document'),QT('guideCode','Select a passage'),QT('guideInspect','Inspect and export')];
  const descriptions=[QT('guideImportText','Choose a TXT or DOCX file, or paste text.'),QT('guideCodeText','Select exact words, then choose or create a code.'),QT('guideInspectText','Trace saved codes to their sources, then download your results.')];
  let action=step===0?'import':step===1?'guide-source':'guide-map',label=step===0?QT('importDlg','Import interview'):step===1?QT('guideRead','Open document'):QT('guideMap','View relationships');
  if(!state.project){action=readonly?(state.projects.length?'guide-examples':'guide-dismiss'):'start-project';label=readonly?QT('chooseProject','Choose a project'):QT('startProject','Start a project');}
  else if(readonly){action=step===2?'guide-map':'guide-source';label=step===2?QT('guideMap','View relationships'):QT('guideRead','Open document');}
  else if(step===1&&!doc()){action='import';label=QT('importDlg','Import interview');}
  if(action==='guide-map'&&!hasBlock('insights')){action='export';label=QT('export','Export');}
  const showAction=!(state.project&&state.view==='coding'&&!doc()&&step===0&&!readonly);
  return `<section class="quick-guide" aria-labelledby="guide-title"><div class="guide-copy"><span class="guide-kicker">${QT('quickStart','Quick start')} · ${step+1} / 3</span><h2 id="guide-title" tabindex="-1">${titles[step]}</h2><p>${readonly?QT('guideReadOnly','This example is read-only. Inspect saved material here; create and code in a local workspace.'):descriptions[step]}</p></div><button class="guide-close" data-action="guide-dismiss" aria-label="${QT('guideClose','Close quick start')}">×</button><div class="guide-controls">${showAction?`<button class="guide-primary-action" data-action="${action}">${label}</button>`:''}<span class="guide-control-spacer"></span><button data-action="guide-back"${step===0?' disabled':''}>${QT('back','Back')}</button><button data-action="guide-next">${step===2?QT('guideDone','Done'):QT('guideNext','Next')}</button><button class="link" data-action="guide-dismiss">${QT('guideSkip','Skip')}</button></div></section>`;
}
function updateGuide() { const region=$('#guide-region');if(region)region.innerHTML=quickGuideHtml(); }
function openGuide(opener) {
  guideReturnFocus=opener;guide={open:true,step:null};
  setGuidePreference(state.project?.id||null,'active',guide.step);updateGuide();
  $('#guide-title')?.focus();
}
function dismissGuide() {
  const inside=document.activeElement?.closest('.quick-guide');
  setGuidePreference(state.project?.id||null,'dismissed');guide.open=false;updateGuide();
  const opener=guideReturnFocus?.isConnected?guideReturnFocus:null;
  if(inside){const target=opener||$('#reading-document')||$('.empty-project [data-action="import"]')||$('#workspace-help-mobile')||$('#workspace-help');target?.focus({preventScroll:true});if(target&&(target.getBoundingClientRect().top<0||target.getBoundingClientRect().bottom>window.innerHeight))target.scrollIntoView({block:'nearest',behavior:'instant'});}
  guideReturnFocus=null;
}
Object.assign(_T.zh,{workspaceIdentity:'QT 0.1 · 本地工作台'});
// Same 7 × 4 pixel geometry and tones as website/components/QtMark.tsx.
// Inline SVG also works when the local workbench runs without the website.
function qtMark() {
  const cells=[[0,0,'ink'],[1,0,'sunkissed'],[2,0,'ink'],[0,1,'ink'],[2,1,'ink'],[0,2,'ink'],[1,2,'sage'],[2,2,'ink'],[2,3,'accent'],[4,0,'terracotta'],[5,0,'ink'],[6,0,'ink'],[5,1,'tidal'],[5,2,'ink']];
  return `<span class="qtmark" role="img" aria-label="QT"><svg viewBox="0 0 55 31" aria-hidden="true" focusable="false">${cells.map(([x,y,tone])=>`<rect x="${x*8}" y="${y*8}" width="7" height="7" rx="1" class="qtmark__cell--${tone}"/>`).join('')}</svg></span>`;
}
function startupHtml() {
  const readonly=state.config.public_demo,last=readonly?null:selectedStartupProject(state.projects,false),recent=state.projects.find(p=>p.id===last);
  return `<a class="workspace-skip" href="#workspace-content">Skip to workspace</a><div class="shell shell--welcome"><main class="welcome-sheet" id="workspace-content" tabindex="-1"><header class="welcome-header"><span class="welcome-brand">${qtMark()}</span><span>${readonly?'Public Bologna demo':QT('localWorkspace','Local workspace')}</span><button id="workspace-help" data-action="guide-open">${QT('help','Help')}</button>${hostedAccountHtml()}</header><div class="welcome-orbit" id="welcome-orbit"><canvas aria-hidden="true"></canvas><div class="welcome-orbit-qt">${qtMark()}</div>${['Import','Coding','Analysis','Plotting','Export'].map(name=>`<span data-satellite="${name}" aria-hidden="true">${name}</span>`).join('')}<button type="button" aria-label="Pause or play the satellite background" aria-pressed="false">Pause motion</button></div><div class="welcome-content"><p class="welcome-eyebrow">${QT('startEyebrow','YOUR NEXT CONVERSATION')}</p><h1 tabindex="-1">${readonly?(state.projects.length?'Explore the record. Keep your own material local.':QT('startReadOnlyEmpty','No example project is available')):QT('startTitle','Start with your material.')}</h1><p class="welcome-intro">${readonly?'Bologna is a public, read-only sample. Inspect codes, draw figures and download results. To upload and save your own material, run QT locally.':QT('startIntro','Import a document, choose an example, or return to your work.')}</p><div id="guide-region">${quickGuideHtml()}</div>
    ${recent?`<section class="welcome-resume"><div><span>${QT('continueLast','Continue last project')}</span><strong>${esc(recent.name)}</strong></div><button class="primary" data-action="open-project" data-id="${esc(recent.id)}">${QT('continueWork','Continue')} →</button></section>`:''}
    ${readonly?`<div class="welcome-options"><section><span class="welcome-number">01 / PUBLIC SAMPLE</span><h2>Bologna · read-only</h2><p>Public interviews with saved codes and source links. No uploads or edits are saved here.</p>${state.projects[0]?`<button class="primary" data-action="open-project" data-id="${esc(state.projects[0].id)}">Explore Bologna →</button>`:''}</section><section><span class="welcome-number">02 / YOUR MATERIAL</span><h2>Start locally</h2><p>Create a project, import TXT or DOCX, and save your coding on your own computer.</p><a class="welcome-install" href="https://github.com/LuX-x7/QualiCraft#local-installation">Local installation ↗</a></section></div>`:`<div class="welcome-options"><section><span class="welcome-number">01</span><h2>${QT('startOwn','Your project')}</h2><p>${QT('startOwnText','Begin with an empty workspace. Add one document when you are ready.')}</p><button class="primary" data-action="start-project">${icon('upload')}${QT('startImport','Import a document')}</button></section>${state.config.bologna_example_available?`<section><span class="welcome-number">02</span><h2>${QT('startExample','Try Bologna')}</h2><p>${QT('startExampleText','Explore saved codes and sources in a separate, editable example copy.')}</p><button data-action="bologna-project">${QT('startExample','Try Bologna')} →</button></section>`:''}</div>`}
    ${!readonly&&state.projects.length?`<section class="welcome-existing"><label for="start-project-select">${QT('existingProjects','Existing projects')}</label><div><select id="start-project-select"><option value="">${QT('chooseProject','Choose a project')}</option>${state.projects.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</select><button data-action="start-open" disabled>${QT('openProject','Open project')}</button></div></section>`:''}
    ${readonly?'':`<div class="welcome-restore"><button class="link" data-action="restore-pick">${QT('restoreProject','Restore project JSON')} ↗</button><span>${QT('restoreSafe','Opens as a new project.')}</span></div><input id="restore-file" type="file" accept=".json" hidden>`}<p class="welcome-local">${readonly?'Public sample · Bologna CC0 · Your reading positions stay in this browser.':QT('startLocal','Projects stay in this workspace. The remembered project and reading positions belong to this browser.')}</p></div></main></div>`;
}
function showStartProject() {
  modal(QT('startName','Name your project'),`<label class="field">${QT('newProjectName','New project name')}<input id="new-project-name" maxlength="160" value="${QT('untitledProject','Untitled research project')}"></label><p>${QT('startCreateNote','Create an empty project, then choose a document. You can cancel the import and return later.')}</p>`,`<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="start-create">${QT('createImport','Create & import')}</button>`);
  $('#dialog').dataset.startup='1';$('#new-project-name').focus();$('#new-project-name').select();
}
function showWorkspaceStart() {
  captureReadingPosition();closeCodePopup();state.project=null;state.docId=null;state.selection=null;state.sourceFocus=null;state.networkReturn=null;state.view='coding';guide.open=false;render();
  $('.welcome-content h1')?.focus({preventScroll:true});
}
function emptyProjectHtml() {
  return `<section class="no-doc empty-project"><span class="empty-project-glyph" aria-hidden="true">${icon('doc')}</span><p class="eyebrow">${QT('emptyEyebrow','EMPTY PROJECT')}</p><h2>${QT('emptyTitle','Ready for your first document.')}</h2><p>${QT('emptyText','Import text, read a passage, and give it a code.')}</p><button class="primary" data-action="import"${demoLock()}>${icon('upload')}${QT('startImport','Import a document')}</button><details class="empty-project-options"><summary>${QT('optionalTools','Optional tools')}</summary><button data-action="code"${demoLock()}>${QT('createCode','Create code')}</button><button data-action="enable-all-blocks"${demoLock()}>${QT('enableAllBlocks','Enable figure workflow')}</button><p>${QT('enableAllBlocksHint','Adds theme grouping, Insights, Figures and Audit to this project. Other blocks keep their current settings.')}</p></details></section>`;
}
async function loadProject(id, created=null) {
  captureReadingPosition();
  const project=created?.id===id?created:await api(`/api/projects/${id}`);
  resetCodingInspector();state.project=project;state.docId=preferredReadingDocument(project);rememberWorkspaceProject(project.id);
  const preference=guidePreference(project.id);guide={open:preference?.status==='active',step:preference?.step??null};guideReturnFocus=null;
  state.selection=null; state.search=''; state.codeFilter=null; state.sourceFocus=null; state.networkReturn=null; NET.restoreFocus=false; state.insightsTab='map'; await loadBackups(); render();
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
  // These reads follow the committed mutation and do not depend on each other.
  const [project,projects]=await Promise.all([api(projectUrl()),api('/api/projects'),loadBackups()]);
  state.project=project;state.projects=projects;render();
}
function showSnapshots(footer='') {
  const rows=state.backups.map(b=>{
    const when=new Date(b.written_at*1000).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',second:'2-digit'});
    return `<div class="snap-row"><span class="snap-name">${esc(b.name)}</span><span class="muted">${esc(when)} · ${Math.round(b.bytes/1024)} KB</span><button data-action="restore-snapshot" data-name="${esc(b.name)}"${demoLock()}>${QT('restoreCopy','Restore as a copy')}</button></div>`;
  }).join('');
  modal(QT('snapshotsTitle','Snapshots'),`<p>${QT('snapshotsIntro','A restorable copy is written after every change. Restoring one creates a new project and leaves this one untouched.')}</p>${rows||`<div class="empty">${QT('noSnapshots','No snapshots yet.')}</div>`}`,footer);
}
function modal(title, body, footer='') {
  pauseImportQueue();documentImport=null;
  const dlg=$('#dialog'); delete dlg.dataset.workflow;delete dlg.dataset.codingId;delete dlg.dataset.codingCodebook;delete dlg.dataset.codingEdit;delete dlg.dataset.startup; dlg.innerHTML=`<div class="modal-head"><h2>${esc(title)}</h2><button data-action="close" aria-label="${QT('close','Close')}">×</button></div><div class="modal-body">${body}<div id="modal-error" role="alert"></div></div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;
  if(!dlg.open) dlg.showModal();
}
function closeModal() { pauseImportQueue();$('#dialog').close(); $('#dialog').innerHTML=''; }
function errorDisplay(error) { if($('#dialog').open && $('#modal-error')) { $('#modal-error').className='inline-error'; $('#modal-error').textContent=error.message; } else toast(error.message,true); }
function render() {
  captureReadingPosition();
  const p=state.project;if(codingInspector.returnTo&&!inspectorReturn())resetCodingInspector();if(!p){readingMounted=null;$('#app').innerHTML=startupHtml();window.mountWelcomeOrbit?.($('#welcome-orbit'));return;}
  window.mountWelcomeOrbit?.(null);
  const pending=p.suggestions.filter(s=>s.status==='pending').length;
  const titles={coding:QT('navCoding','Coding workspace'),insights:QT('navInsights','Insights'),audit:QT('navAudit','Audit trail'),plotting:QT('navPlotting','Figures')};
  $('#app').innerHTML=`<a class="workspace-skip" href="#workspace-content">Skip to workspace</a><div class="shell shell--${state.view}">
    <aside class="sidebar"><div class="brand">${qtMark()}<span class="version">ALPHA</span></div>
    <div class="section-label">${QT('project','PROJECT')}</div><select id="project-select" class="project-select" aria-label="${QT('switchProject','Switch project')}">${state.projects.map(x=>`<option value="${esc(x.id)}" ${x.id===p.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
    <button class="link new-project" data-action="projects">${QT('newProject','+ New / import project')}</button>
    <nav class="nav" aria-label="Main navigation">${[['coding','grid',QT('navCoding','Coding workspace')],['insights','chart',QT('navInsights','Insights')],['plotting','image',QT('figures','Figures')],['audit','history',QT('navAudit','Audit trail')]].filter(([view])=>view==='coding'||view==='plotting'||hasBlock(view)).map(([view,i,t])=>`<button class="${state.view===view?'active':''}" data-action="view" data-view="${view}" title="${t}" aria-label="${t}"${state.view===view?' aria-current="page"':''}>${icon(i)}<span class="nav-label">${t}</span></button>`).join('')}</nav>
    <div class="sidebar-scroll">
    <input id="side-filter" class="side-filter" type="search" autocomplete="off" spellcheck="false" aria-label="${QT('filterSidebar','Filter documents and codes')}" placeholder="${QT('filterSidebar','Filter documents and codes')}" value="${esc(state.sideFilter)}">
    <div id="side-list">${sideListHtml()}</div>
    <div class="side-title"><div class="section-label">${QT('tools','TOOLS')} <span class="count">${(p.blocks||[]).length}/${BLOCKS.length}</span></div></div><button class="side-item" data-action="tools" title="Add or remove capability blocks"><span class="tools-glyph">\u229e</span><span class="name">${QT('toolsDlg','Capability blocks')}</span><span class="count">${(p.blocks||[]).length}</span></button>
    </div><div class="local-note"><span class="status-dot"></span><div><strong>${QT('localWorkspace','Local workspace')}</strong><span>${QT('cloudNote','Cloud only when requested')}</span></div></div></aside>
    <main class="workspace" id="workspace-content" tabindex="-1"><header class="topbar"><div class="breadcrumb"><strong>${esc(p.name)}</strong><span>${titles[state.view]}</span></div><div class="top-actions">${saveStateHtml()}<button data-action="toggle-motion" aria-pressed="${motionPreference==='reduce'}" title="${QT('motionHint','Reduce movement, or follow system preferences')}">${motionLabel()}</button><button data-action="toggle-lang" title="${QT('switchLanguage','Switch language')}">${QT_LANG==='zh'?'EN':'ZH'}</button><button data-action="settings">${icon('setting')}${QT('model','Model')}</button><button data-action="export">${icon('down')}${QT('export','Export')}</button><button id="workspace-help" data-action="guide-open">${QT('help','Help')}</button></div></header>
    ${state.config.public_demo?`<div class="public-demo-banner" role="status"><strong>${QT('publicDemo','Public demo')}</strong><span>${QT('publicDemoNote','Read-only sample project. Changes and uploads are disabled here; run QualiCraft locally to code your own material.')}</span></div>`:''}
    ${!state.config.public_demo&&isBolognaExample(p)?`<details class="example-context"><summary><strong>${QT('bolognaLabel','Bologna example')}</strong><span>${QT('editableExample','Editable in this local workspace')}</span></summary><button class="link" data-action="start-project">${QT('startOwnAction','Start your own project')} →</button></details>`:''}
    <section class="project-strip"><div><h1>${esc(p.name)}</h1><div class="metrics"><span><b>${p.documents.length}</b> documents</span><span><b>${p.codes.length}</b> codes</span><span><b>${p.annotations.length}</b> codings</span><span class="pending-metric"><b>${pending}</b> ${QT('reviewCount','to review')}</span></div></div><div class="project-strip-actions">${hostedAccountHtml()}<button data-action="documents">${QT_LANG==='zh'?'管理文档':'Manage documents'}</button><button class="primary" data-action="import"${demoLock()}>${icon('upload')}${QT('importDlg','Import interview')}</button></div></section>
    <div id="job-status"></div><div class="mobile-only mobile-project-bar"><button class="link" data-action="projects">${state.config.public_demo?QT('switchProject','Switch project'):QT('mobileSwitch','Switch / create project')}</button><button id="workspace-help-mobile" class="link" data-action="guide-open">${QT('help','Help')}</button></div>
    <div id="guide-region">${quickGuideHtml()}</div>
    ${state.view==='coding'?codingView():state.view==='insights'?insightsView():state.view==='plotting'?plottingView():auditView()}
    <footer class="bottom-bar"><span>${QT('workspaceIdentity','QT 0.1 · LOCAL WORKSPACE')}</span><span>${QT('footerTagline','Exact source ranges · Researcher-reviewed coding')}</span></footer></main></div>`;
  renderJob();
  loadPlotPreview();
  loadNetwork();
  focusNetworkSource();
  mountReading();
  if(state.view==='coding'&&(inspectorReturn()||codingInspector.drawer)){refreshInspector();}
  previewCoding(state.view==='coding'&&inspectorReturn()?(codingInspector.ids.length?codingInspector.ids:inspectorCurrent()?[inspectorCurrent().id]:[]):state.view==='coding'&&overviewPreviewNavigation()&&readingOverviewFocus?readingOverviewFocus.ids:[]);
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
    const filtered=state.codeFilter?new Set([state.codeFilter,...codeDescendants(state.codeFilter)]):null;
    const source=active.some(x=>x.id===state.sourceFocus),overview=readingOverviewFocus?.key===markKey(state.project.id,doc().id)&&a<readingOverviewFocus.end&&b>readingOverviewFocus.start,classes=[source?'source-target':'',overview?'overview-source-target':'',filtered&&active.some(x=>filtered.has(x.code_id))?'coding-filtered':''].filter(Boolean).join(' ');
    return `<mark${classes?` class="${classes}"`:''} tabindex="0" role="button" aria-label="${esc(QT('inspectPassage','Inspect coded passage'))}" data-coding-ids="${esc(JSON.stringify(active.map(x=>x.id)))}" data-coding-count="${active.length}" title="${esc(activeCodes.map(c=>c.name).join(' · '))}">${part}</mark>`;
  }).join('');
}

function codingView() {
  const d=doc();if(!d)return emptyProjectHtml();
  ensureReadingOverview();
  return `${networkSourceTrailHtml()}<section class="reading-dock" aria-label="${QT('readingNavigation','Reading navigation')}">
    <div class="reading-primary"><label class="reading-document-label" for="reading-document">${icon('doc')}<span class="sr-only">${QT('readingDocument','Current document')}</span></label><select id="reading-document" aria-label="${QT('readingDocument','Current document')}">${state.project.documents.map(item=>`<option value="${esc(item.id)}" ${item.id===d.id?'selected':''}>${esc(item.name)}</option>`).join('')}</select><output id="reading-position" aria-label="${QT('readingPosition','Reading position')}"></output><button data-action="reading-resume" title="${QT('readingResumeHint','Return to the saved paragraph in this browser. Position is not a read mark.')}">${QT('readingResume','Resume')}</button><button type="button" data-action="reading-overview" aria-expanded="${readingOverview.open}" aria-controls="reading-overview">${QT('ovOverview','Overview')}</button></div>
    <div class="reading-marks" id="reading-marks" role="group" aria-label="${QT('projectMarks','Project reading marks')}"><select id="reading-mark-status" aria-label="${QT('projectMark','Project mark')}">${['unmarked','read','revisit'].map(status=>`<option value="${status}">${markLabel(status)}</option>`).join('')}</select><button type="button" data-action="reading-mark-read">${QT('markRead','Mark read')}</button><button type="button" data-action="reading-mark-undo" disabled>${QT('markUndo','Undo')}</button><button type="button" data-action="reading-mark-retry" hidden>${QT('markRetry','Retry')}</button><button type="button" data-action="reading-mark-reset" hidden>${QT('markReset','Reset marks…')}</button><span id="reading-mark-save"></span></div>
    <div class="reading-context" tabindex="0" role="region" aria-label="${QT('readingPaths','Coding paths at this position')}"><span id="reading-path-label">${QT('readingHere','Codings here')}</span><span id="reading-code-path"></span></div><span id="reading-announcement" class="sr-only" role="status"></span>
  </section><div class="work-grid coding-single"><section class="document-pane" id="document-pane" aria-label="Source transcript">
  <div class="document-tools"><input id="search" class="search" type="search" placeholder="${QT('searchDoc','Search in document')}" aria-label="Search transcript" value="${esc(state.search)}"><button class="mobile-only reading-tools-toggle" data-action="reading-tools" aria-expanded="false" aria-controls="reading-coding-tools">${QT('readingTools','Coding tools')}</button><button type="button" class="coding-codebook-entry" data-action="coding-codebook">${inspectorTitle()}</button><div class="tool-group" id="reading-coding-tools"><button data-action="code"${demoLock()}>${QT('newCode','+ New code')}</button><button class="primary${hasBlock('ai')?'':' block-off'}" data-action="analyze"${demoLock()}>${icon('star')}${QT('analyzeAi','Analyse with AI')}</button></div></div>
  <section id="reading-overview" class="reading-overview" aria-labelledby="overview-title" ${readingOverview.open?'':'hidden'}>${readingOverviewHtml()}</section>
  ${state.importReceipt===d.id?`<div class="import-receipt" role="status">${icon('doc')}<strong>${QT('importedLocal')}</strong><span>✓</span></div>`:''}<details class="reading-details"><summary>${QT('readingDetails','Document details & notes')}<span>${segments(d.text).length} ${QT('readingParagraphs','paragraphs')} · ${state.project.annotations.filter(a=>a.document_id===d.id).length} ${QT('savedCodings')}</span></summary><div class="reader-header"><div><h2 class="reader-heading" tabindex="-1">${esc(d.name)}</h2><div class="reader-meta">${cp(d.text).length.toLocaleString()} characters · ${segments(d.text).length} segments · ${state.project.annotations.filter(a=>a.document_id===d.id).length} codings</div></div></div>
  <p class="reading-marks-help">${QT('markPolicy','Project marks are manual and shared with this file; they do not prove reading or understanding. Reading-only changes are saved to the project and enter its next snapshot. Export JSON to keep this state now. JSON format v5 requires this version of QT.')}</p><p class="reading-memory-note">${QT('readingMemoryNote','Position only · stored in this browser, outside project exports. Scrolling does not mark text as read.')}</p><div class="reading-note${hasBlock('memos')?'':' block-off'}"><label class="reading-note-label" for="doc-memo">${QT('readingNotes','READING NOTES')}</label><textarea id="doc-memo" rows="2" placeholder="${QT('readingPlaceholder','First impressions, questions to follow up, anything that stands out.')}">${esc(d.memo||'')}</textarea><span class="reading-note-state" id="doc-memo-state"></span></div></details>
  <div id="reader">${readerHtml()}</div></section>${inspectorWide()?`<aside class="coding-inspector" aria-label="${inspectorTitle()}"><div id="coding-inspector-body">${inspectorBodyHtml()}</div></aside>`:''}</div>`;
}
function readerHtml() {
  const d=doc(), annotations=state.project.annotations.filter(a=>a.document_id===d.id);
  // Match the sidebar's rolled-up scope, including codings on the parent itself.
  const filterCodes=state.codeFilter?new Set([state.codeFilter,...codeDescendants(state.codeFilter)]):null;
  const paras=segments(d.text).filter(p=> (!state.search||p.text.toLocaleLowerCase().includes(state.search.toLocaleLowerCase())) && (!filterCodes||annotations.some(a=>filterCodes.has(a.code_id)&&a.start<p.end&&a.end>p.start)));
  const filter=state.codeFilter?`<p class="tiny-label reader-code-filter">${QT('codeFilterLabel')}: ${esc(codeIdentity(state.project.codes.find(c=>c.id===state.codeFilter)))} <button class="link" data-action="clear-filter">${QT('clearFilters','Clear filters')}</button></p>`:'';
  return `<div class="coding-key"><span>${QT('codingHighlight')}</span><span>${QT('codingHighlightFocus')}</span><small>${QT('codingKeyHint')}</small></div>`+filter+(paras.map(p=>{
    const matches=annotations.filter(a=>a.start<p.end&&a.end>p.start);
    return `<div class="paragraph" data-start="${p.start}" data-end="${p.end}" tabindex="-1" data-reading-mark="${paragraphMark(d,p.start)}"><span class="line-no">${String(p.index+1).padStart(2,'0')}<span class="reading-mark-badge" role="img" aria-label="${markLabel(paragraphMark(d,p.start))}" title="${markLabel(paragraphMark(d,p.start))}"${paragraphMark(d,p.start)==='unmarked'?' hidden':''}>${paragraphMark(d,p.start)==='read'?'✓':paragraphMark(d,p.start)==='revisit'?'↺':''}</span></span><div class="passage ${p.speaker==='doctor'?'doctor':''}" data-start="${p.start}">${highlight(p.text,p.start,annotations)}</div><div class="paragraph-codings">${matches.length?`<button type="button" data-action="inspect-paragraph" data-start="${p.start}" aria-label="${matches.length} ${QT('savedCodings')}">${matches.length} ${QT('savedCodings')}</button>`:''}</div></div>`;
  }).join('') || `<div class="empty">${QT('noPassages','No passages match your filters.')}<button class="link" data-action="clear-filter">${QT('clearFilters','Clear filters')}</button></div>`);
}
function suggestionsHtml() {
  const suggestions=state.project.suggestions.filter(s=>s.document_id===state.docId&&s.status===state.reviewFilter);
  return suggestions.map((s,i)=>`<article class="suggestion"><div class="card-eyebrow"><span>${s.source==='synthetic_demo'?QT('demoSuggest','DEMO SUGGESTION'):QT('aiSuggest','AI SUGGESTION')}</span><span>#${String(i+1).padStart(2,'0')}</span></div><h3>${esc(s.code_name)}</h3>${s.definition?`<p class="definition">${esc(s.definition)}</p>`:''}<button class="quote-btn" data-action="locate" data-start="${s.start}" title="${QT('locateQuote','Locate this quotation in the source')}"><span>“${esc(s.quote)}”</span><small>Source range [${s.start}, ${s.end}) · Locate ↗</small></button><div class="rationale-label">${QT('rationale','RATIONALE')}</div><p class="reason">${esc(s.rationale)}</p>${s.status==='pending'?`<div class="card-actions"><button class="primary" data-action="review" data-id="${s.id}" data-decision="accept"${demoLock()}>Accept coding</button><button data-action="review" data-id="${s.id}" data-decision="reject"${demoLock()}>Reject</button></div>`:`<small class="decision-state">${s.status==='accepted'?QT('acceptedState','Accepted by researcher'):QT('rejectedState','Rejected · decision recorded')}</small>`}</article>`).join('') || `<div class="empty"><span class="empty-symbol">◇</span><strong>${QT('noSuggestions','No suggestions in this view')}</strong><span>${QT('runAiOrChoose','Run AI coding or choose another review status.')}</span></div>`;
}
function insightsView() {
  const p=state.project, counts=p.codes.map(c=>({...c,count:p.annotations.filter(a=>a.code_id===c.id).length})).sort((a,b)=>b.count-a.count);
  const max=Math.max(1,...counts.map(c=>c.count));
  const tabs=[['map',QT('network','Relationship map')],['frequency',QT('codeFreq','Code frequency')],['matrix',QT('docCodeMatrix','Document × code')]];
  const nav=`<nav class="insights-nav" aria-label="${QT('insightsViews')}">${tabs.map(([id,label])=>`<button data-action="insights-tab" data-tab="${id}" aria-pressed="${state.insightsTab===id}">${label}</button>`).join('')}</nav>`;
  const frequency=`<section class="panel"><h2>${QT('codeFreq','Code frequency')}</h2><p>${QT('freqDesc','Each confirmed quotation–code link counts once. Frequency is not importance or a count of participants. Pending suggestions are excluded.')}</p>${counts.map(c=>`<div class="bar-row"><span>${esc(c.name)}</span><div class="bar-track"><div class="bar-value" style="width:${c.count/max*100}%;background:${esc(c.color)}"></div></div><b>${c.count}</b></div>`).join('')||`<div class="empty">${QT('applyCodesHint','Apply codes to see your research take shape.')}</div>`}</section>`;
  const matrix=`<section class="panel"><h2>${QT('docCodeMatrix','Document × code')}</h2><p>${QT('matrixDesc','Export the complete matrix as CSV for further analysis and plotting.')}</p><div class="table-wrap"><table><thead><tr><th>Document</th>${p.codes.map(c=>`<th>${esc(c.name)}</th>`).join('')}</tr></thead><tbody>${p.documents.map(d=>`<tr><td>${esc(d.name)}</td>${p.codes.map(c=>`<td>${p.annotations.filter(a=>a.document_id===d.id&&a.code_id===c.id).length}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
  const map=`<section class="panel"><h2>${QT('network','Relationship map')}</h2><p>${QT('networkDesc')}</p>
    <label class="network-picker">${QT('selectNetwork')}<select id="network-select" aria-label="${QT('selectNetwork')}" disabled><option value="">${QT('netLoading','Building the map…')}</option></select></label>
    <div class="network-controls" role="group" aria-label="${QT('network','Relationship map')}"><button data-action="net-prev" id="network-prev" disabled>← ${QT('previousNode')}</button><button data-action="net-next" id="network-next" disabled>${QT('nextNode')} →</button><button data-action="net-passages" id="network-passages" disabled>${QT('showPassages')}</button><button data-action="net-clear" id="network-clear" disabled>${QT('netClear','Clear selection')}</button></div>
    <p id="network-selection" class="network-selection" aria-live="polite" aria-atomic="true">${QT('noNetworkSelection')}</p><p class="network-note" id="network-key-help">${QT('networkKeys')}</p>
    <div class="network-layout"><div><div id="network-stage" class="network-stage"><div class="network-empty">${QT('netLoading','Building the map…')}</div></div><div id="network-legend" class="network-legend"></div><p class="network-note">${QT('mapPreview')}</p></div>
    <section id="network-evidence" class="network-evidence" aria-label="${QT('evidenceTitle')}"><h3>${QT('evidenceTitle')}</h3><p>${QT('netLoading','Building the map…')}</p></section></div></section>`;
  return `<div class="view-body insights-body"><div class="qca-entry"><div><strong>Comparative QCA</strong><p>Define cases and calibrate sets independently of descriptive coding counts.</p></div><button data-action="open-qca">Open QCA workspace</button></div>${nav}${state.insightsTab==='frequency'?frequency:state.insightsTab==='matrix'?matrix:map}</div>`;
}
let plotBlobUrl = null;
let plotSerial=0;
let plotAppearanceOpen=false;
let plotUi={key:null,status:'idle',blob:null,serial:0,controller:null};
const plotPreviewSources = new WeakMap();

function showPlotViewer(opener) {
  const preview = document.getElementById('plot-preview');
  const source = preview && plotPreviewSources.get(preview);
  if (!source || !preview.complete || !preview.naturalWidth || document.getElementById('plot-viewer')) return;
  // Own this URL until close: a background refresh must not revoke this view.
  const url = URL.createObjectURL(source);
  const dialog = document.createElement('dialog');
  dialog.id = 'plot-viewer';
  dialog.setAttribute('aria-labelledby', 'plot-viewer-title');
  dialog.setAttribute('aria-describedby', 'plot-viewer-hint');
  dialog.innerHTML = `<div class="plot-viewer-head"><h2 id="plot-viewer-title">${esc(preview.alt)} · ${QT('plotViewer')}</h2><button type="button" data-plot-view="close" aria-label="${QT('plotClose')}">×</button></div>
    <div class="plot-viewer-tools" role="group" aria-label="${QT('plotScale')}">
      <button type="button" data-plot-view="out" aria-label="${QT('plotZoomOut')}">−</button>
      <button type="button" data-plot-view="in" aria-label="${QT('plotZoomIn')}">+</button>
      <button type="button" data-plot-view="actual" aria-label="${QT('plotActual')}" aria-pressed="true">100%</button>
      <button type="button" data-plot-view="fit" aria-pressed="false">${QT('plotFit')}</button>
      <output aria-label="${QT('plotScale')}" aria-live="polite">100%</output>
      <a href="${esc(url)}" download="qualicraft-${esc(state.plotOptions.kind)}.svg">${QT('plotSvg')}</a>
    </div>
    <p id="plot-viewer-hint">${QT('plotViewHint')}</p>
    <div class="plot-viewer-viewport" tabindex="0" role="region" aria-label="${QT('plotPan')}" aria-describedby="plot-viewer-hint"><img class="plot-viewer-image" src="${esc(url)}" alt="${esc(preview.alt)}"></div>`;
  document.body.append(dialog);
  const viewport = dialog.querySelector('.plot-viewer-viewport');
  const image = dialog.querySelector('img');
  const steps = [.25, .5, .75, 1, 1.5, 2, 3, 4];
  let scale = 1, mode = 'actual';
  function zoom(next, nextMode, reset = false) {
    const x = (viewport.scrollLeft + viewport.clientWidth / 2) / (preview.naturalWidth * scale);
    const y = (viewport.scrollTop + viewport.clientHeight / 2) / (preview.naturalHeight * scale);
    scale = next; mode = nextMode;
    image.style.width = (preview.naturalWidth * scale) + 'px';
    dialog.querySelector('output').textContent = Math.round(scale * 100) + '%';
    dialog.querySelector('[data-plot-view="out"]').disabled = scale <= steps[0];
    dialog.querySelector('[data-plot-view="in"]').disabled = scale >= steps.at(-1);
    dialog.querySelector('[data-plot-view="actual"]').setAttribute('aria-pressed', String(Math.abs(scale - 1) < .001));
    dialog.querySelector('[data-plot-view="fit"]').setAttribute('aria-pressed', String(mode === 'fit'));
    viewport.scrollLeft = reset ? 0 : x * preview.naturalWidth * scale - viewport.clientWidth / 2;
    viewport.scrollTop = reset ? 0 : y * preview.naturalHeight * scale - viewport.clientHeight / 2;
  }
  function control(name) {
    if (name === 'close') { dialog.close(); return; }
    if (name === 'actual') zoom(1, 'actual', true);
    if (name === 'fit') zoom(viewport.clientWidth / preview.naturalWidth, 'fit');
    if (name === 'in' && scale < steps.at(-1)) zoom(steps.find(value => value > scale + .001) ?? steps.at(-1), 'zoom');
    if (name === 'out' && scale > steps[0]) zoom(steps.findLast(value => value < scale - .001) ?? steps[0], 'zoom');
  }
  dialog.addEventListener('click', event => {
    const button = event.target.closest('[data-plot-view]');
    if (button && !button.disabled) control(button.dataset.plotView);
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const items = [...dialog.querySelectorAll('button:not(:disabled), a[href], [tabindex="0"]')];
      const edge = event.shiftKey ? items[0] : items.at(-1);
      if (document.activeElement === edge) {
        event.preventDefault(); (event.shiftKey ? items.at(-1) : items[0]).focus();
      }
      return;
    }
    if (event.target !== viewport) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = {'+':'in', '=':'in', '-':'out', '−':'out', '0':'actual'}[event.key];
    if (key) { event.preventDefault(); control(key); }
  });
  const resize = () => { if (mode === 'fit') control('fit'); };
  window.addEventListener('resize', resize);
  dialog.addEventListener('close', () => {
    window.removeEventListener('resize', resize);
    document.documentElement.classList.remove('plot-viewer-open');
    dialog.remove(); URL.revokeObjectURL(url);
    if (opener?.isConnected && !opener.disabled) opener.focus({preventScroll:true});
  }, {once:true});
  document.documentElement.classList.add('plot-viewer-open');
  dialog.showModal(); zoom(1, 'actual', true); viewport.focus();
}

function figureKinds(){return [
 ['frequency',QT('kindFrequency','Code frequency'),plotWords('Compare codes.','比较编码。')],
 ['coverage',QT('kindCoverage','Code × interview'),plotWords('Compare interviews.','比较访谈。')],
 ['cooccurrence',QT('kindCooccurrence','Co-occurrence heatmap'),plotWords('Inspect code pairs.','检查编码对。')],
 ['hierarchy',plotWords('Code hierarchy','编码层级'),plotWords('Compare saved groups.','比较已有分组。')],
 ['accumulation',QT('kindAccumulation','Code accumulation'),plotWords('Follow filename order.','按文件名顺序查看。')]
];}
function plotWords(en,zh){return QT_LANG==='zh'?zh:en;}
function plotDefaults(){if(!state.plotOptions)state.plotOptions={kind:'frequency',level:'code',mode:'overlap',palette:'YlGnBu',cluster:1,method:'ward',annotate:1,top:15,title:'',fontsize:9};}
function plotKey(){return JSON.stringify([state.project.id,state.project.updated_at,plotQuery()]);}
function resetPlotUi(key){
  plotUi.controller?.abort();if(plotBlobUrl)URL.revokeObjectURL(plotBlobUrl);plotBlobUrl=null;
  plotUi={key,status:'idle',blob:null,error:null,serial:++plotSerial,controller:null,elapsed:null,exporting:false,download:null};
}
function ensurePlotUi(){plotDefaults();const key=plotKey();if(plotUi.key!==key)resetPlotUi(key);}
function plotPrerequisite(){
 if(!hasBlock('plotting'))return {kind:'disabled',title:plotWords('Figures are off for this project','本项目未启用图表'),body:plotWords('Enable Figures to use these five views. Your coding stays unchanged.','启用图表即可使用这五种视图，已有编码保持不变。')};
 if(!state.config.plotting?.available)return {kind:'unavailable',title:plotWords('The drawing tools are unavailable','绘图依赖尚不可用'),body:state.config.hosted?plotWords('The server drawing tools need attention. Your coding is saved; contact the QT host.','服务器绘图依赖需要检查。编码已保存，请联系 QT 管理者。'):plotWords('Install the drawing dependency and restart the local workbench.','安装绘图依赖后重新启动本地工作台。')};
 const ids=new Set(state.project.codes.map(c=>c.id));
 if(!state.project.annotations.some(a=>ids.has(a.code_id)))return {kind:'no-codings',title:plotWords('No saved codings','尚无已保存的编码标注'),body:plotWords('Return to Coding and code a passage. Pending suggestions do not count as saved coding.','返回编码工作区标注一段原句。待审核建议不计为已保存标注。')};
 return null;
}
function plotFailure(status,message,options){
 const body=String(message||plotWords('The request could not complete.','请求未能完成。'));
 if(status===400&&/^No overlapping code ranges/.test(body)&&options.kind==='cooccurrence'){
  const unit=options.mode==='unit',top=Math.min(60,Math.max(1,Number(options.top)||15));
  return {state:'empty',title:unit?plotWords('No shared-passage pairs','没有同段落编码对'):plotWords('No overlapping pairs','没有重叠编码对'),body:(unit?plotWords(`Among the top ${top} codes, no distinct code pair occurs in the same passage.`,`前 ${top} 个编码中没有同段落的不同编码对。`):plotWords(`Among the top ${top} codes, no distinct code pair has overlapping ranges.`,`前 ${top} 个编码中没有区间重叠的不同编码对。`))+' '+plotWords('This is an empty result. Review the coding, increase Top N, or choose another figure. Change the rule only if it fits your method.','这是空结果。可检查已有编码、扩大前 N 个编码范围或选择其他图；仅在符合研究方法时更改规则。')};
 }
 if(status===400&&/^There is nothing to plot yet/.test(body))return {state:'empty',title:plotWords('No saved codings','尚无已保存的编码标注'),body:plotWords('Return to Coding to review the saved project.','返回编码工作区检查已保存项目。')};
 if(status===400&&/^This figure has no data at this setting/.test(body))return {state:'empty',title:plotWords('No data for these settings','当前设置没有数据'),body:plotWords('Review the settings or choose another figure. Your saved coding is unchanged.','请检查设置或选择其他图，已保存编码不变。')};
 return {state:'error',title:plotWords('Could not generate the preview','无法生成预览'),body};
}
function plotStatusText(){
 const label=(figureKinds().find(k=>k[0]===state.plotOptions.kind)||figureKinds()[0])[1];
 if(plotUi.exporting)return plotWords('Preparing download…','正在准备下载…');
 if(plotUi.download)return plotUi.download;
 if(plotUi.status==='loading')return plotWords(`Generating ${label}…`,`正在生成${label}…`);
 if(plotUi.status==='ready')return plotWords(`Preview ready · ${plotUi.elapsed?.toFixed(1)} s`,`预览已生成 · ${plotUi.elapsed?.toFixed(1)} 秒`);
 if(plotUi.status==='empty')return plotWords('Empty result · review the explanation below.','空结果 · 请查看下方说明。');
 if(plotUi.status==='error')return plotWords('Preview failed · details below.','预览失败 · 请查看下方原因。');
 return plotWords('Choose a figure, then generate its preview.','选择图表后生成预览。');
}
function updatePlotStatus(){
 const output=document.getElementById('plot-status');if(output)output.textContent=plotStatusText();
 const generate=document.querySelector('[data-action="plot-generate"]');if(generate)generate.disabled=!!plotPrerequisite()||plotUi.status==='loading';
 const download=document.querySelector('[data-action="plot-export"]');if(download)download.disabled=plotUi.status!=='ready'||plotUi.exporting;
 const stage=document.querySelector('.plot-stage');if(stage)stage.setAttribute('aria-busy',String(plotUi.status==='loading'));
}
function loadPlotPreview(){
 if(state.view!=='plotting'){if(plotUi.status==='loading')resetPlotUi(plotUi.key);return;}
 const img=document.getElementById('plot-preview');if(!img||!plotUi.blob)return;
 const serial=plotUi.serial,key=plotUi.key;
 plotPreviewSources.set(img,plotUi.blob);if(!plotBlobUrl)plotBlobUrl=URL.createObjectURL(plotUi.blob);
 img.addEventListener('load',()=>{
  if(!img.isConnected||plotUi.serial!==serial||plotUi.key!==key)return;
  if(!img.naturalWidth)return;
  if(plotUi.status==='loading'){plotUi.status='ready';plotUi.elapsed=(Date.now()-plotUi.started)/1000;plotUi.controller=null;}
  img.classList.remove('loading');const button=document.querySelector('[data-action="plot-view"]');if(button)button.disabled=false;updatePlotStatus();
 },{once:true});
 img.addEventListener('error',()=>{
  if(!img.isConnected||plotUi.serial!==serial)return;
  plotUi.status='error';plotUi.error=plotFailure(0,plotWords('The returned preview could not be displayed. Try again.','返回的预览无法显示，请重试。'),state.plotOptions);plotUi.blob=null;render();
 },{once:true});
 img.src=plotBlobUrl;
}
async function generatePlotPreview(){
 ensurePlotUi();if(plotPrerequisite()||plotUi.status==='loading')return;
 const focusGenerate=document.activeElement?.dataset?.action==='plot-generate';
 const options={...state.plotOptions},key=plotKey(),url=projectUrl('plot')+'?'+plotQuery();resetPlotUi(key);
 const serial=plotUi.serial;plotUi.status='loading';plotUi.started=Date.now();plotUi.controller=new AbortController();const signal=plotUi.controller.signal;render();if(focusGenerate)document.getElementById('plot-status')?.focus({preventScroll:true});
 const current=()=>state.view==='plotting'&&plotUi.key===key&&plotUi.serial===serial&&plotKey()===key;
 try{
  const response=await fetch(url,{headers:{'X-QualiCraft-Token':state.token},signal});
  if(!response.ok){const problem=await response.json().catch(()=>({error:`HTTP ${response.status}`}));const error=new Error(problem.error||`HTTP ${response.status}`);error.status=response.status;throw error;}
  const blob=await response.blob();if(!current())return;
  plotUi.blob=blob;render();
 }catch(error){
  if(error.name==='AbortError'||!current())return;
  plotUi.error=plotFailure(error.status,error.message,options);plotUi.status=plotUi.error.state;plotUi.controller=null;render();
 }
}
function plotQuery(){const q=new URLSearchParams();Object.keys(state.plotOptions).forEach(k=>{const v=state.plotOptions[k];if(v!==''&&v!==null)q.set(k,String(v));});return q.toString();}
function plottingView(){
 ensurePlotUi();const conf=state.config.plotting||{},o=state.plotOptions,pre=plotPrerequisite(),kinds=figureKinds();
 const kindLabel=(kinds.find(k=>k[0]===o.kind)||kinds[0])[1];
 const select=(key,choices)=>`<select data-plot="${key}">`+choices.map(([v,label])=>`<option value="${v}"${String(o[key])===String(v)?' selected':''}>${esc(label)}</option>`).join('')+'</select>';
 const field=(key,label,choices)=>`<label class="field">${label}${select(key,choices)}</label>`;
 const onOff=[['1',QT('on','On')],['0',QT('off','Off')]],palettes=['YlGnBu','viridis','Blues','Greens','magma','rocket','mako','flare','crest'];
 const choices=`<fieldset class="plot-kinds"><legend>${plotWords('Choose a figure','选择图表')}</legend><div class="plot-kind-grid">`+kinds.map(([id,label,hint])=>`<label class="plot-kind"><input type="radio" data-plot="kind" name="plot-kind" value="${id}"${o.kind===id?' checked':''}><span><strong>${esc(label)}</strong><small>${esc(hint)}</small></span></label>`).join('')+'</div></fieldset>';
 const primary=(o.kind==='frequency'?field('level',QT('groupBy','Group by'),[['code',QT('codes','Codes')],['theme',QT('themes','Themes')]]):'')
  +(o.kind==='cooccurrence'?field('mode',QT('countWithin','Count within'),[['overlap',QT('withinOverlap','Overlapping text')],['unit',QT('withinPassage','The same passage')]]):'')
  +(['frequency','coverage','cooccurrence'].includes(o.kind)?field('top',QT('topN','Top N codes'),[10,15,20,30,40,60].map(n=>[String(n),String(n)])):'');
 const advanced=(['coverage','cooccurrence'].includes(o.kind)?field('palette',QT('palette','Palette'),palettes.map(n=>[n,n])):'')
  +(o.kind==='cooccurrence'?field('cluster',QT('clustering','Clustering'),onOff)+field('method',QT('linkage','Linkage'),[['ward','Ward'],['complete','Complete'],['average','Average'],['single','Single']])+field('annotate',QT('showCounts','Show counts'),[['1',QT('yes','Yes')],['0',QT('no','No')]]):'')
  +field('fontsize',QT('baseFontSize','Base font size'),[7,8,9,10,11,12].map(n=>[String(n),n+' pt']))
  +`<label class="field">${QT('titleOpt','Title')}<input type="text" data-plot="title" value="${esc(o.title)}" placeholder="${QT('optional','Optional')}"></label>`;
 let stage;
 if(pre)stage=`<div class="plot-empty"><strong>${esc(pre.title)}</strong><p>${esc(pre.body)}</p>`+(pre.kind==='disabled'?`<button data-action="enable-figures"${demoLock()}>${plotWords('Enable Figures','启用图表')}</button>`:pre.kind==='unavailable'&&!state.config.hosted?`<pre>${esc(conf.install||'pip install matplotlib')}</pre>`:'')+`<button class="link" data-action="view" data-view="coding">← ${plotWords('Continue coding','继续编码')}</button></div>`;
 else if(plotUi.error)stage=`<div class="plot-empty plot-${plotUi.status}"><strong>${esc(plotUi.error.title)}</strong><p>${esc(plotUi.error.body)}</p>${plotUi.status==='error'?`<button data-action="plot-generate">${plotWords('Retry preview','重试预览')}</button>`:''}<button class="link" data-action="view" data-view="coding">← ${plotWords('Continue coding','继续编码')}</button></div>`;
 else if(plotUi.blob)stage=`<img class="plot-preview${plotUi.status==='loading'?' loading':''}" id="plot-preview" alt="${esc(kindLabel)}">`;
 else stage=`<div class="plot-empty"><strong>${plotUi.status==='loading'?plotWords('Generating preview…','正在生成预览…'):plotWords('Ready to generate','可以生成预览')}</strong><p>${plotUi.status==='loading'?plotWords('The existing drawing script is running. Large hierarchies can take longer.','正在运行现有绘图脚本，较大的层级图可能需要更多时间。'):plotWords('Choose one of the five figures above, then select Generate preview.','从上方五种图中选择一种，再点击生成预览。')}</p></div>`;
 return `<div class="view-body"><section class="panel figure-workflow"><h2 id="figures-heading" tabindex="-1">${QT('navPlotting','Figures')}</h2>${choices}<div class="plot-grid"><div class="plot-controls">${primary}<details class="plot-options"${plotAppearanceOpen?' open':''}><summary>${plotWords('Appearance options','外观选项')}</summary>${advanced}</details>${o.kind==='cooccurrence'&&conf.optional_missing?.includes('scipy')?`<p class="muted">${plotWords('Clustering is unavailable here; the figure will remain unclustered.','本环境不支持聚类，将生成未聚类图。')}</p>`:''}<button class="primary" data-action="plot-generate"${pre||plotUi.status==='loading'?' disabled':''}>${plotWords('Generate preview','生成预览')}</button><output id="plot-status" tabindex="-1" role="status" aria-live="polite">${esc(plotStatusText())}</output></div><div class="plot-preview-wrap"><div class="plot-preview-tools"><button type="button" data-action="plot-view" disabled>${QT('plotEnlarge')}</button></div><div class="plot-stage" tabindex="0" role="region" aria-label="${plotWords('Figure preview · scroll or enlarge to explore','图表预览 · 可滚动或放大查看')}" aria-busy="${plotUi.status==='loading'}">${stage}</div></div></div><div class="plot-actions"><button data-action="plot-export"${plotUi.status!=='ready'||pre||plotUi.exporting?' disabled':''}>${QT('plotExportBtn','Download figure + script')}</button><span class="muted">${QT('plotExportNote','A folder with the counts as CSV, the script, and the figure as SVG, PDF and 300 dpi PNG.')}</span></div></section></div>`;
}
function changePlotOption(target){
 const key=target.dataset.plot,value=target.value,appearance=document.querySelector('.plot-options');
 if(appearance)plotAppearanceOpen=appearance.open;
 state.plotOptions[key]=value;
 if(key==='title'){
  // Blur fires before a button's click. Keep that button mounted so the same
  // click can generate; invalidate only the previous result, not the controls.
  ensurePlotUi();const stage=document.querySelector('.plot-stage');
  if(stage&&!plotPrerequisite())stage.innerHTML=`<div class="plot-empty"><strong>${plotWords('Ready to generate','可以生成预览')}</strong></div>`;
  const viewer=document.querySelector('[data-action="plot-view"]');if(viewer)viewer.disabled=true;updatePlotStatus();return;
 }
 const focus=target.type==='radio'||target.tagName==='SELECT';render();
 if(focus){const field=[...document.querySelectorAll('[data-plot]')].find(n=>n.dataset.plot===key&&n.value===value);field?.focus({preventScroll:true});}
}
document.addEventListener('toggle',e=>{if(e.target.matches?.('.plot-options'))plotAppearanceOpen=e.target.open;},true);
async function exportPlotBundle(){
 ensurePlotUi();if(plotUi.status!=='ready'||plotUi.exporting||plotPrerequisite())return;
 const key=plotUi.key,url=projectUrl('plot-bundle')+'?'+plotQuery(),label=(figureKinds().find(k=>k[0]===state.plotOptions.kind)||figureKinds()[0])[1],started=Date.now();
 plotUi.exporting=true;plotUi.download=null;updatePlotStatus();
 try{
  const response=await fetch(url,{headers:{'X-QualiCraft-Token':state.token}});
  if(!response.ok){const problem=await response.json().catch(()=>({error:`HTTP ${response.status}`}));throw Error(problem.error||`HTTP ${response.status}`);}
  const blob=await response.blob(),target=URL.createObjectURL(blob),link=document.createElement('a');link.href=target;link.download='qualicraft-figure.zip';link.click();setTimeout(()=>URL.revokeObjectURL(target),1000);
  if(plotUi.key===key)plotUi.download=plotWords(`Download sent to browser · ${((Date.now()-started)/1000).toFixed(1)} s`,`下载已交给浏览器 · ${((Date.now()-started)/1000).toFixed(1)} 秒`);
  toast(`${label} · ${plotWords('download sent to browser','下载已交给浏览器')}`);
 }catch(error){if(plotUi.key===key)plotUi.download=plotWords('Download failed: ','下载失败：')+error.message;toast(error.message,true);}
 finally{if(plotUi.key===key){plotUi.exporting=false;updatePlotStatus();}}
}

const actionNames={document_remove:QT_LANG==='zh'?'文档已移除':'Document removed',reading_mark_set:QT('projectMark','Project mark'),reading_marks_reset:QT('markReset','Reading marks reset'),document_import:'Document imported',code_create:QT('createCode','Create code'),annotation_create:'Coding created',suggestion_review:'Suggestion reviewed',analysis_start:'Analysis started',analysis_segment:'Segment analyzed',analysis_finish:'Analysis finished',benchmark_import:'Benchmark imported',annotation_remove:'Coding removed',memo_update:'Memo updated',project_restore:'Project restored'};
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
let popupWriteBusy=false;
function codePopupMatches(query) {
  const needle=query.trim().toLowerCase();
  const all=state.project.codes.map(c=>({code:c,path:codePath(c)})),paths=new Map();
  all.forEach(m=>paths.set(m.path,(paths.get(m.path)||0)+1));
  all.forEach(m=>{
    m.identity=paths.get(m.path)>1?`${m.path} · ${m.code.id}`:m.path;
    const full=needle&&(m.path.toLowerCase()===needle||m.identity.toLowerCase()===needle);
    const name=needle&&m.code.name.toLowerCase()===needle;
    m.exact=!!(full||name);m.rank=full?0:name?1:2;
  });
  // All saved codes remain reachable. The viewport scrolls; identities are not capped.
  return needle?all.filter(m=>m.exact||m.identity.toLowerCase().includes(needle)).sort((a,b)=>a.rank-b.rank):all;
}
function popupSelectedCode(){
 const matches=state.popupMatches||[];
 if((!state.popupCursorMoved&&matches.filter(m=>m.exact).length>1)||state.popupCursor<0)return null;
 return matches[state.popupCursor]?.code.id||null;
}
function showCodePopup() {
  removeCodePopupDom();
  const sel=state.selection;if(!sel)return;
  const host=document.createElement('div');host.id='code-popup';host.className='code-popup';
  host.innerHTML=`<label class="code-picker-label" for="code-search">${QT('codebookFind','Find a code')}</label>
    <div class="code-popup-row"><input id="code-search" type="text" role="combobox" aria-label="${QT('codebookFind','Find a code')}" aria-autocomplete="list" aria-expanded="true" aria-controls="code-suggest" aria-describedby="code-picker-help code-match-count" autocomplete="off" spellcheck="false" placeholder="${QT_LANG==='zh'?'搜索名称或完整路径':'Search names or full paths'}"><button class="code-popup-x" data-action="close-popup" aria-label="${esc(QT('closeEsc','Close (Esc)'))}">✕</button></div>
    <div class="code-match-count" id="code-match-count" role="status"></div>
    <div class="code-suggest" id="code-suggest" role="listbox" aria-label="${QT('selectCode','Select a code')}"></div>
    <p class="code-picker-help" id="code-picker-help">${QT_LANG==='zh'?'滚动浏览全部编码，或搜索。↑ ↓ 选择；Enter 应用；Home / End 首尾定位。':'Scroll all codes or search. ↑ ↓ choose; Enter applies; Home / End reach the first / last.'}</p>
    <div class="code-popup-foot"><span class="code-popup-count">${sel.end-sel.start}${QT('charsLabel',' characters')}${state.selectionSpansParagraphs?QT('spansParagraphs',' (spans paragraphs)'):''}</span><button data-action="annotate">${esc(QT('moreOptions','More options…'))}</button><button data-action="analyze-selection">${esc(QT('analyzeSel','Analyse with AI'))}</button></div>`;
  document.body.appendChild(host);renderCodeSuggest('');positionCodePopup();setTimeout(positionCodePopup,120);setTimeout(positionCodePopup,320);
  const input=$('#code-search');if(input){input.focus();input.addEventListener('input',e=>{renderCodeSuggest(e.target.value);positionCodePopup();});input.addEventListener('keydown',e=>{
    if(e.isComposing||e.keyCode===229)return;
    if(e.key==='Enter'){e.preventDefault();submitCodePopup().catch(errorDisplay);}
    else if(e.key==='Escape'){e.preventDefault();if(!popupWriteBusy)closeCodePopup();}
    else if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key)){e.preventDefault();movePopupCursor({ArrowDown:1,ArrowUp:-1,PageDown:8,PageUp:-8,Home:'first',End:'last'}[e.key]);}
  });}
}
function positionCodePopup() {
  const host=$('#code-popup');if(!host)return;
  const anchor=pendingRange?pendingRange.getBoundingClientRect():(state.selectionRect||null);
  if(!anchor||(!anchor.width&&!anchor.height))return;
  const list=$('#code-suggest'),vw=window.innerWidth,vh=window.innerHeight,gap=8;
  const above=anchor.top-gap*2,below=vh-anchor.bottom-gap*2,useBelow=below>=above,room=Math.max(130,useBelow?below:above);
  if(list){const chrome=host.getBoundingClientRect().height-(list.getBoundingClientRect().height||0);list.style.maxHeight=Math.max(56,Math.min(300,room-chrome))+'px';}
  const box=host.getBoundingClientRect();let left=Math.max(gap,Math.min(anchor.left,vw-box.width-gap)),top=useBelow?anchor.bottom+gap:anchor.top-box.height-gap;
  host.style.left=left+'px';host.style.top=Math.max(gap,Math.min(top,vh-box.height-gap))+'px';
}
function updateCodeSuggestCount(){
 const count=$('#code-match-count');if(count)count.textContent=popupWriteBusy?(QT_LANG==='zh'?'正在保存编码…':'Saving coding…'):`${state.popupMatches?.length||0} / ${state.project.codes.length} ${QT_LANG==='zh'?'个编码':'codes'}`;
}
function syncPopupCursor(){
 const rows=[...(document.querySelectorAll?.('#code-suggest .suggest-row')||[])],index=state.popupCursor??-1,input=$('#code-search');
 rows.forEach((row,i)=>{row.classList.toggle('active',i===index);row.setAttribute?.('aria-selected',String(i===index));});
 if(index>=0&&rows[index])input?.setAttribute?.('aria-activedescendant',`code-candidate-${index}`);else input?.removeAttribute?.('aria-activedescendant');
}
function renderCodeSuggest(query) {
  const box=$('#code-suggest');if(!box)return;
  const needle=query.trim(),matches=codePopupMatches(needle),exact=matches.some(m=>m.exact),ambiguous=matches.filter(m=>m.exact).length>1;
  state.popupMatches=matches;state.popupCursor=needle?0:-1;state.popupCursorMoved=false;
  const rows=matches.map((m,i)=>`<button type="button" role="option" tabindex="-1" id="code-candidate-${i}" aria-selected="${i===state.popupCursor}" class="suggest-row${i===state.popupCursor?' active':''}" data-action="popup-apply" data-id="${m.code.id}"><span class="dot" style="background:${esc(m.code.color)}"></span><span class="suggest-text"><strong class="suggest-name">${esc(m.code.name)}</strong>${m.identity!==m.code.name?`<small class="suggest-path">${esc(m.identity)}</small>`:''}</span></button>`).join('');
  const createRow=needle&&!exact?`<button type="button" role="option" tabindex="-1" id="code-candidate-${matches.length}" aria-selected="${state.popupCursor===matches.length}" class="suggest-row create${state.popupCursor===matches.length?' active':''}" data-action="popup-create" data-name="${esc(needle)}">${esc(QT('createCodeTpl','＋ Create “%s” and code it').replace('%s',needle))}</button>`:'';
  box.innerHTML=rows+createRow||`<div class="suggest-empty">${esc(QT('noCodesYet','No codes yet — type a keyword to create one'))}</div>`;box.scrollTop=0;
  const help=$('#code-picker-help');if(help)help.textContent=ambiguous?QT('popupChoosePath'):(QT_LANG==='zh'?'滚动浏览全部编码，或搜索。↑ ↓ 选择；Enter 应用；Home / End 首尾定位。':'Scroll all codes or search. ↑ ↓ choose; Enter applies; Home / End reach the first / last.');
  updateCodeSuggestCount();syncPopupCursor();
}
function movePopupCursor(delta) {
  if(popupWriteBusy)return;
  const rows=[...document.querySelectorAll('#code-suggest .suggest-row')];if(!rows.length)return;
  const current=state.popupCursor??-1,next=delta==='first'?0:delta==='last'?rows.length-1:Math.max(0,Math.min(rows.length-1,current+delta));
  state.popupCursor=next;state.popupCursorMoved=true;syncPopupCursor();rows[next].scrollIntoView({block:'nearest'});
}
function setPopupSaving(value){
 popupWriteBusy=value;const host=$('#code-popup');if(!host)return;host.setAttribute('aria-busy',String(value));
 for(const button of document.querySelectorAll('#code-popup button'))button.disabled=value;
 const input=$('#code-search');if(input)input.disabled=value;updateCodeSuggestCount();
}
async function commitPopupCoding(codeId,name=null){
 const sel=state.selection;if(!sel||popupWriteBusy)return;const projectId=state.project.id;setPopupSaving(true);
 try{
  if(name!==null){const code=await saveCoding('codes',{name,definition:'',color:null});codeId=code.id;if(state.project?.id!==projectId)return;}
  await saveCoding('annotations',{document_id:sel.document_id,start:sel.start,end:sel.end,code_id:codeId,memo:''});
  if(state.project?.id===projectId){if(state.selection===sel){closeCodePopup();state.selection=null;}render();toast(name===null?QT('toastCoded','Coded.'):QT('toastCodeCreated','Created “%s” and coded it.').replace('%s',name));}
 }finally{setPopupSaving(false);}
}
async function applyCodeById(codeId){return commitPopupCoding(codeId);}
async function createAndApplyCode(name){return commitPopupCoding(null,name);}
async function submitCodePopup() {
  const input=$('#code-search');if(!input||popupWriteBusy)return;const q=input.value.trim(),matches=state.popupMatches||[];
  if(!state.popupCursorMoved&&matches.filter(m=>m.exact).length>1){toast(QT('popupChoosePath'),true);return;}
  const pick=matches[state.popupCursor??-1];if(pick)return applyCodeById(pick.code.id);
  if(q)return createAndApplyCode(q);
  toast(QT('toastNeedKeyword','Type a keyword first, or pick a code from the list.'),true);
}
function locate(start) {
  if(state.search||state.codeFilter){state.search='';state.codeFilter=null;render();}
  const para=[...document.querySelectorAll('.paragraph')].find(el=>Number(el.dataset.start)<=start&&Number(el.dataset.end)>start);
  if(para){para.scrollIntoView({behavior:'smooth',block:'center'});para.classList.add('flash');setTimeout(()=>para.classList.remove('flash'),1800);}
}
const importQueues=new Map();
let activeImportQueue=null;
function queueForProject() {
  const pid=state.project.id;
  if(!importQueues.has(pid)){
    let storage;try{storage=localStorage;}catch(error){}
    let wasRunning=false;
    importQueues.set(pid,new window.QTImportQueue.Queue({projectId:pid,id:importRequestId,storage,read:window.QTImportQueue.readFile,
      check:body=>api(`${QT_BASE}/api/projects/${pid}/document-check`,body),save:body=>api(`${QT_BASE}/api/projects/${pid}/documents`,body),
      changed:q=>{if(activeImportQueue===q&&$('#dialog').open&&$('#dialog').dataset.workflow==='import-queue'&&state.project?.id===pid)renderImportQueue(q);else if(wasRunning&&!q.running&&q.rows.some(r=>r.state==='saved'))refreshImportedProject(pid).catch(error=>toast(error.message,true));wasRunning=q.running;}}));
  }
  return importQueues.get(pid);
}
function pauseImportQueue() {
  const queue=activeImportQueue;if(!queue)return;
  activeImportQueue=null;queue.pause();
  if(queue.rows.some(r=>r.state==='saved'))refreshImportedProject(queue.projectId).catch(error=>toast(error.message,true));
}
async function refreshImportedProject(pid) {
  const p=await api(`${QT_BASE}/api/projects/${pid}`);if(state.project?.id!==pid)return;
  state.project=p;state.projects=await api('/api/projects');if(state.project?.id!==pid)return;
  await loadBackups();if(state.project?.id!==pid)return;
  const focused=document.activeElement,focusId=focused?.id,selection=focused?.selectionStart;
  render();
  if($('#dialog').open||focused?.isConnected&&focused!==document.body)return;
  const target=(focusId&&document.getElementById(focusId))||[...document.querySelectorAll('[data-action="import"]')].find(el=>el.getClientRects().length);
  if(target&&!target.disabled){target.focus({preventScroll:true});if(typeof selection==='number'&&target.setSelectionRange)target.setSelectionRange(selection,selection);}
}
function showImportQueue(files=[]) {
  const queue=queueForProject();
  if(files.length)queue.add(files);
  modal(QT('queueTitle','Import queue'),`<p class="io-intro">${QT('queueIntro','TXT / DOCX · 8 MB each · max 100 files per queue and 100 documents per project.')}</p>
    <div class="io-queue-pickers"><label class="file-picker"><span class="file-picker-button">${QT('queueAdd','Add files')}</span><input id="queue-add-files" type="file" multiple accept=".txt,.docx" aria-label="${QT('queueAdd','Add files')}"></label><label class="file-picker"><span class="file-picker-button">${QT('queueReselect','Reselect original files')}</span><input id="queue-reselect-files" type="file" multiple accept=".txt,.docx" aria-label="${QT('queueReselect','Reselect original files')}"></label></div>
    <p class="io-queue-help">${QT('queueRestoreHint','Close pauses after the current file. Reselect originals after refresh; browser storage contains queue metadata only.')}</p>
    <p id="queue-storage" role="alert" hidden></p><div id="queue-summary" role="status" aria-live="polite"></div><progress id="queue-progress" max="1" value="0" aria-label="${QT('queueProgress','Processed files')}"></progress><ol id="import-queue-list" class="io-queue-list"></ol>`,
    `<button data-action="close">${QT('close','Close')}</button><button data-action="queue-pause">${QT('queuePause','Stop after current file')}</button><button data-action="queue-clear">${QT('queueClear','Clear finished items')}</button><button class="primary" data-action="queue-start">${QT('queueStart','Start / resume')}</button>`);
  $('#dialog').dataset.workflow='import-queue';activeImportQueue=queue;renderImportQueue(queue);
}
function queueStateLabel(row) {
  return QT('queueState_'+row.state,{'queued':'Queued','reading':'Reading file…','checking':'Checking text…','saving':'Saving…','saved':'Saved locally','failed':'Failed','duplicate':'Same name and text — choose','cancelled':'Cancelled','needs-file':'Reselect original file'}[row.state]);
}
function renderImportQueue(q) {
  const focused=document.activeElement,focusKey=focused?.dataset.queueFocus,selection=focused?.selectionStart;
  const counts=q.counts(),done=counts.saved+counts.cancelled+counts.failed;
  $('#queue-summary').textContent=`${counts.saved} ${QT('queueSaved','saved')} · ${counts.failed} ${QT('queueFailed','failed')} · ${counts.cancelled} ${QT('queueCancelled','cancelled')} · ${counts.duplicate} ${QT('queueDecisions','decisions')} · ${counts.total} ${QT('queueTotal','total')}${q.running?' · '+QT(q.paused?'queueStopping':'queueRunning',q.paused?'Stopping after current file…':'Importing…'):''}`;
  const progress=$('#queue-progress');progress.max=Math.max(1,counts.total);progress.value=done;
  const storage=$('#queue-storage');storage.hidden=!q.storageError;storage.textContent=q.storageError;
  const active=q.rows.find(r=>['reading','checking','saving'].includes(r.state));
  $('#import-queue-list').innerHTML=q.rows.map((r,i)=>{
    const busy=['reading','checking','saving'].includes(r.state),step={queued:0,reading:1,checking:2,saving:3,saved:4}[r.state]||0;
    return `<li class="io-queue-row is-${r.state}" data-queue-id="${esc(r.id)}"><div class="io-queue-heading"><span class="io-kicker">${String(i+1).padStart(2,'0')}</span><strong>${esc(r.filename)}</strong><span>${r.size.toLocaleString()} B</span></div>
      ${r.attempted?`<div class="io-queue-name">${QT('importName')} · ${esc(r.name)}</div>`:`<label class="field">${QT('importName')}<input data-queue-name="${esc(r.id)}" data-queue-focus="name:${esc(r.id)}" value="${esc(r.name)}" maxlength="200" ${q.running?'disabled':''}></label>`}
      <div class="io-queue-state" role="status">${esc(queueStateLabel(r))}</div>${busy?`<progress max="4" value="${step}" aria-label="${esc(r.filename)} · ${esc(queueStateLabel(r))}"></progress>`:''}
      ${r.error?`<p class="io-queue-error">${esc(r.error)}</p>`:''}
      ${r.state==='duplicate'?`<p class="io-queue-note">${esc(QT('importDuplicateText').replace('%s',r.name))}</p>`:''}
      <div class="io-queue-actions">${r.state==='duplicate'?`<button data-action="queue-cancel" data-id="${esc(r.id)}" data-queue-focus="cancel:${esc(r.id)}">${QT('queueCancelFile','Cancel this file')}</button><button data-action="queue-keep" data-id="${esc(r.id)}" data-queue-focus="keep:${esc(r.id)}">${QT('importKeep')}</button>`:''}
      ${r.state==='failed'?`<button data-action="queue-retry" data-id="${esc(r.id)}" data-queue-focus="retry:${esc(r.id)}">${QT('queueRetry','Retry this file')}</button>`:''}
      ${['queued','failed','needs-file'].includes(r.state)?`<button data-action="queue-cancel" data-id="${esc(r.id)}" data-queue-focus="cancel:${esc(r.id)}">${QT('queueCancelFile','Cancel this file')}</button>`:''}
      ${r.state==='saved'?`<button data-action="queue-view" data-id="${esc(r.documentId)}" data-queue-focus="view:${esc(r.id)}">${QT('queueView','View document')}</button>`:''}</div></li>`;
  }).join('');
  $('[data-action="queue-start"]').disabled=q.running||!q.rows.some(r=>r.state==='queued');
  $('[data-action="queue-pause"]').disabled=!q.running||q.paused;
  $('[data-action="queue-clear"]').disabled=q.running||!q.rows.some(r=>['saved','cancelled'].includes(r.state));
  $('#queue-add-files').disabled=q.running;$('#queue-reselect-files').disabled=q.running;
  if(focusKey){const next=[...document.querySelectorAll('[data-queue-focus]')].find(el=>el.dataset.queueFocus===focusKey);if(next&&!next.disabled){next.focus({preventScroll:true});if(next.tagName==='INPUT'&&selection!==null)next.setSelectionRange(selection,selection);}else ($('[data-action="queue-start"]:not(:disabled)')||$('.modal-footer [data-action="close"]')).focus({preventScroll:true});}
  else if(active&&document.activeElement===document.body)$('#queue-summary').setAttribute('tabindex','-1');
}

let documentImport=null;
function importRequestId() {
  // Plain-HTTP phone access may omit randomUUID; getRandomValues is available.
  return crypto.randomUUID?.()||Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
}
function importActive(session) {
  return documentImport===session&&$('#dialog').open&&$('#dialog').dataset.workflow==='import'&&state.project?.id===session.projectId;
}
function resetImportDecision() {
  if(!documentImport)return;
  documentImport.version++;documentImport.body=null;documentImport.confirmation=null;documentImport.requestId=importRequestId();
  $('#import-duplicate').hidden=true;$('[data-action="save-document"]').hidden=false;$('[data-action="keep-document"]').hidden=true;
  $('#modal-error').textContent='';
}
function importBusy(busy) {
  $('#import-source').disabled=busy;
  for(const action of ['save-document','keep-document'])$(`[data-action="${action}"]`).disabled=busy;
  $('#import-status').textContent=busy?QT('importChecking'):'';
}
async function saveDocument(keep=false) {
  const session=documentImport;if(!session||session.busy||!importActive(session))return;
  session.busy=true;const version=session.version;importBusy(true);
  try {
    if(!session.body){
      const file=$('#import-file').disabled?null:$('#import-file').files[0];
      if(!$('#import-file').disabled&&!file)throw new Error(QT('importEmpty'));
      const body={name:$('#document-name').value||file?.name,text:$('#document-text').value,request_id:session.requestId};
      if(file){
        if(file.size>8_000_000)throw new Error('File exceeds 8 MB.');
        if(/\.docx$/i.test(file.name)){
          const bytes=new Uint8Array(await file.arrayBuffer());let binary='';
          for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
          body.docx_base64=btoa(binary);delete body.text;
        }else if(/\.txt$/i.test(file.name))body.text=new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());
        else throw new Error('Choose a TXT or DOCX file.');
      }
      if(!importActive(session)||version!==session.version)return;
      session.body=body;
    }
    if(keep&&!session.confirmation)return;
    const d=await api(`${QT_BASE}/api/projects/${session.projectId}/documents`,{...session.body,...(keep?{duplicate_confirmation:session.confirmation}:{})});
    if(!importActive(session)||version!==session.version)return;
    if(d.requires_confirmation){
      session.confirmation=d.duplicate.confirmation;
      const warning=$('#import-duplicate');warning.hidden=false;
      warning.querySelector('strong').textContent=QT('importDuplicate');
      warning.querySelector('p').textContent=QT('importDuplicateText').replace('%s',d.duplicate.name);
      $('[data-action="save-document"]').hidden=true;$('[data-action="keep-document"]').hidden=false;
      warning.scrollIntoView({block:'nearest'});
      $('[data-action="close"][data-import-cancel]').focus({preventScroll:true});return;
    }
    importedDocument(d.id);closeModal();await refresh();focusImportedDocument();toast(QT('interviewImported','Interview imported.'));
  } catch(error) {if(importActive(session))throw error;}
  finally {session.busy=false;if(importActive(session))importBusy(false);}
}

function showImport() {
  const queue=window.QTImportQueue?queueForProject():null;
  modal(QT('importDlg','Import interview'), `<p class="io-intro">${QT('importShort')}</p>
    ${queue?.rows.length?`<button class="io-queue-resume" data-action="queue-open">${QT('queueOpen','Review / resume import queue')} · ${queue.rows.length}</button>`:''}<p class="io-queue-help">${QT('queueChooseHint','Choose multiple files to open an import queue.')}</p><fieldset id="import-source" class="io-import-source"><div class="io-modes" role="group" aria-label="${QT('importDlg')}"><button type="button" data-action="import-mode" data-mode="file" aria-pressed="true">${icon('upload')}${QT('importFileMode')}</button><button type="button" data-action="import-mode" data-mode="paste" aria-pressed="false">${icon('doc')}${QT('importPasteMode')}</button></div>
    <div id="import-file-panel"><label class="field io-file-label"><span class="file-picker io-file-picker">${icon('upload')}<span><strong class="file-picker-button">${QT('chooseFile')}</strong><span class="file-picker-name" data-file-name="import-file">${QT('noFileSelected')}</span></span><input id="import-file" type="file" multiple accept=".txt,.docx" aria-label="${QT('chooseFile')}"></span><small>${QT('importFormats')}</small></label><div id="import-preview" class="io-source-preview" hidden></div></div>
    <div id="import-paste-panel" hidden><label class="field">${QT('importPaste')}<textarea id="document-text" rows="6" placeholder="Interviewer: …&#10;Participant: …" disabled></textarea></label></div>
    <label class="field">${QT('importName')}<input id="document-name" placeholder="${QT('docNamePlaceholder')}" maxlength="200"></label>
    <details class="io-help"><summary>${QT('importHelp')}</summary><p>${QT('importDesc')}</p><p>${QT('fileHint')}</p></details>
    <button class="link io-table-link" data-action="import-export-open">${QT('importTableLink')} ↗</button></fieldset><section id="import-duplicate" class="io-duplicate" role="status" aria-live="polite" hidden><strong></strong><p></p></section><div id="import-status" role="status"></div>`,
    `<button data-action="close" data-import-cancel>${QT('cancelImport')}</button><button class="primary" data-action="save-document">${QT('importBtn')}</button><button class="primary" data-action="keep-document" hidden>${QT('importKeep')}</button>`);
  $('#dialog').dataset.workflow='import';
  documentImport={projectId:state.project.id,version:0,requestId:importRequestId(),body:null,confirmation:null,busy:false};
}
function setImportMode(mode) {
  resetImportDecision();
  const file=mode==='file';
  $('#import-file-panel').hidden=!file; $('#import-paste-panel').hidden=file;
  $('#import-file').disabled=!file; $('#document-text').disabled=file;
  document.querySelectorAll('[data-action="import-mode"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  $('#modal-error').textContent='';
  (file?$('#import-file'):$('#document-text')).focus();
}
async function updateImportPreview() {
  const input=$('#import-file'),preview=$('#import-preview'),file=input?.files[0];
  if(!preview)return;
  preview.hidden=!file;if(!file)return;
  preview.innerHTML=`<div class="io-file-meta">${icon('doc')}<strong>${esc(file.name)}</strong><span>${file.size.toLocaleString()} B</span></div>`;
  if(file.size>8_000_000)return;
  if(/\.txt$/i.test(file.name)){
    try{
      const text=new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());
      if(!preview.isConnected||input.files[0]!==file)return;
      preview.insertAdjacentHTML('beforeend',`<span class="io-kicker">${QT('importReady')}</span><pre>${esc(cp(text).slice(0,800).join(''))}</pre>`);
    }catch(error){if(preview.isConnected)preview.insertAdjacentHTML('beforeend',`<p>${esc(error.message)}</p>`);}
  }else if(/\.docx$/i.test(file.name))preview.insertAdjacentHTML('beforeend',`<p>${QT('importDocxReady')}</p>`);
}
function importedDocument(id) {
  state.docId=id;state.selection=null;state.sourceFocus=null;state.search='';state.codeFilter=null;state.sideFilter='';state.view='coding';state.importReceipt=id;
}
function focusImportedDocument() {
  const heading=$('.reader-heading');if(!heading)return;
  const details=heading.closest('details');if(details)details.open=true;
  heading.focus({preventScroll:true});
  if(window.innerWidth<=800)heading.scrollIntoView({block:'start'});
}
/* A second path through the same dialog: another tool's coding export. The
   file is sent whole and the server works out which exporter produced it, so
   the researcher does not have to know that OpenQDA and NVivo both emit CSV. */
function showImportExport() {
  modal(QT('importOther','Import a coding table'), `<p>${QT('importTableShort')}</p><label class="field">${QT('chooseFile','Choose a file')}<span class="file-picker"><span class="file-picker-button">${QT('chooseFile','Choose a file')}</span><span class="file-picker-name" data-file-name="import-export">${QT('noFileSelected','No file selected')}</span><input id="import-export" type="file" accept=".csv,.tsv,.zip,.xlsx" aria-label="${QT('chooseFile','Choose a file')}"></span><small>${QT('importOtherFormats','OpenQDA or NVivo CSV · QualCoder .zip · ATLAS.ti or FAIRqual .xlsx')}</small></label><label class="field">${QT('importOtherName','Project name (optional)')}<input id="import-name" maxlength="160" placeholder="${QT('importOtherNamePh','Defaults to the file name')}"></label><div id="import-status" class="muted"></div>`, `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="run-import">${QT('importOtherBtn','Import coding table')}</button>`);
  $('#dialog').dataset.workflow='import-table';
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
    importedDocument(created.documents[0]?.id || null);
    render();focusImportedDocument();
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
  modal(QT('createCode','Create code'),`<label class="field">${QT('codeName','Name')}<input id="code-name" maxlength="160" placeholder="${QT('codeNamePlaceholder','e.g. Information barriers')}"></label>${researchRoleField('code-role')}<label class="field">${QT('codeDef','Definition and inclusion criteria')}<textarea id="code-definition" rows="4" placeholder="${QT('codeDefPlaceholder','Describe when to use this code and when to exclude it.')}"></textarea></label>${parents.length&&hasBlock('hierarchy')?`<label class="field">${QT('groupUnder','Group under (optional)')}<select id="code-parent"><option value="">${QT('topLevel','— top level —')}</option>${parents.map(c=>`<option value="${c.id}" ${parentId===c.id?'selected':''}>${esc(codePath(c))}</option>`).join('')}</select><small>${QT('groupHint','Choosing a parent makes this a sub-code. Grouping codes under a theme is what turns a flat tag list into a codebook.')}</small></label>`:''}<label class="field">${QT('color','Color')}<input id="code-color" type="color" value="#427d77"></label>`, `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="save-code">${QT('saveCode','Save code')}</button>`);
}
function researchRoleField(id,value=null) {
  const labels=[['',QT('roleUnassigned','Not assigned')],['theme',QT('researchTheme','Theme')],['category',QT('researchCategory','Category')],['code',QT('codeRole','Code')]];
  return `<label class="field">${QT('researchRole','Research role')}<select id="${id}">${labels.map(([v,label])=>`<option value="${v}" ${v===(value||'')?'selected':''}>${label}</option>`).join('')}</select><small>${QT('researchRoleHint','You choose the role. It stays when the node moves and does not change counts.')}</small></label>`;
}
function codeEditValues() {
  return {name:$('#ec-name').value,definition:$('#ec-definition').value,color:$('#ec-color').value,
    parent_id:$('#ec-parent').value||null,status:$('#ec-status').value,memo:$('#ec-memo').value,
    inclusion:$('#ec-inclusion').value,exclusion:$('#ec-exclusion').value,
    anchor_examples:$('#ec-anchors').value.split('\n').map(x=>x.trim()).filter(Boolean),research_role:$('#ec-role').value||null};
}
function codeEditChanges(values,baseline) {
  return Object.fromEntries(Object.entries(values).filter(([key,value])=>JSON.stringify(value)!==JSON.stringify(baseline[key])));
}
function showCodeEdit(id) {
  const c=state.project.codes.find(x=>x.id===id); if(!c) return;
  const blocked=codeDescendants(id);
  const {own,total}=codeCounts();
  const others=state.project.codes.filter(x=>x.id!==id);
  modal(QT('editCode','Edit code'), `
    <label class="field">Name<input id="ec-name" maxlength="160" value="${esc(c.name)}"></label>
    ${researchRoleField('ec-role',c.research_role)}
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
  $('#dialog').codeEditBaseline=codeEditValues();
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
  const excluded=codeDescendants(id); excluded.add(id);
  const others=state.project.codes.filter(x=>!excluded.has(x.id));
  modal(QT('mergeCode','Merge code'), `<p>Move every coding from <b>${esc(src.name)}</b> into another code, then remove it.</p>
    <label class="field">Merge into<select id="merge-target"${others.length?'':' disabled'}>${others.map(o=>`<option value="${o.id}">${esc(codePath(o))}</option>`).join('')}</select></label>
    ${others.length?'':'<p class="notice">No eligible target: choose a code outside this branch.</p>'}
    <div class="notice">Sub-codes of <b>${esc(src.name)}</b> are re-parented to the target. A coding that would duplicate an existing target coding on the same passage is collapsed rather than copied.</div>`,
    `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="code-merge" data-id="${id}"${others.length?'':' disabled'}>Merge</button>`);
}
function showAnnotation(preferredId=null) {
  if(!state.selection)return;
  const matches=codePopupMatches(''),selected=matches.find(m=>m.code.id===preferredId);
  modal(QT('codePassage','Code this passage'),`<blockquote class="big-quote">${esc(cut(doc().text,state.selection.start,state.selection.end))}</blockquote><label class="field">${QT('selectCode','Select a code')}<select id="annotation-code"><option value=""${selected?'':' selected'}>${QT_LANG==='zh'?'请选择编码':'Choose a code…'}</option>${matches.map(m=>`<option value="${m.code.id}"${m===selected?' selected':''}>${esc(m.identity)}</option>`).join('')}</select></label><p class="annotation-code-path" id="annotation-code-path">${esc(selected?.identity||'')}</p><label class="field${hasBlock('memos')?'':' block-off'}">Research memo (optional)<textarea id="annotation-memo" rows="3" placeholder="${QT('memoPlaceholder','Record your interpretation or a question for comparison.')}"></textarea></label>`, `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="save-annotation"${selected?'':' disabled'}>${QT('applyCode','Apply code')}</button>`);
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
  modal(QT('projectsTitle','Research projects'),`${state.projects.length?`<label class="field">${QT('existingProjects','Existing projects')}<select id="modal-project-select">${state.projects.map(p=>`<option value="${p.id}" ${p.id===state.project?.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><button data-action="switch-project">${QT('openProject','Open project')}</button>`:''}<hr class="project-divider"><label class="field">${QT('newProjectName','New project name')}<input id="new-project-name" placeholder="${QT('untitledProject','Untitled research project')}" maxlength="160"></label><div class="project-dialog-actions"><button class="primary" data-action="new-project"${demoLock()}>${QT('createProject','Create project')}</button>${state.config.bologna_example_available?`<button data-action="bologna-project"${demoLock()}>${QT('startExample','Try Bologna')}</button>`:''}<button data-action="restore-pick"${demoLock()}>${QT('restoreProject','Restore project JSON')}</button></div><details class="project-more"><summary>${QT('moreProjectSources','Other example sources')}</summary><div class="option-grid"><button class="option-card" data-action="grounded-project"><strong>${QT('groundedProject','Tian 2021 · software architecture interviews')}</strong><span>${QT('groundedDesc','Import 8 semi-structured practitioner interviews. IP1–IP2 pair Chinese responses with English translations; IP3–IP8 are in English.')}</span></button><button class="option-card" data-action="demo-project"><strong>${QT('demoProject','Fictional care interview')}</strong><span>${QT('demoDesc','Explore a fictional transcript, sample coding, and fixed review suggestions.')}</span></button><button class="option-card" data-action="benchmark-project"><strong>${QT('benchmarkProject','TU Delft · blind workspace')}</strong><span>${QT('benchmarkDesc','Import 7 transcripts and 54 codes, without reference annotations.')}</span></button><button class="option-card" data-action="reference-project"><strong>${QT('referenceProject','TU Delft · researcher reference')}</strong><span>${QT('referenceDesc','Explore 377 researcher annotations for comparison. These are not model predictions.')}</span></button></div><p>${QT('guideNote','Guide collections are imported from the local Guide directory and retain source provenance in the project audit trail.')}</p></details><input id="restore-file" type="file" accept=".json" hidden>`,`<button data-action="workspace-home">${QT('backStart','Back to start')}</button><button data-action="close">${QT('close','Close')}</button>`);
}

async function locateReportEvidence(evidence) {
  const project=await api(projectUrl()),annotation=project.annotations.find(a=>a.id===evidence.id),source=project.documents.find(d=>d.id===evidence.document_id);
  if(!annotation||!source||annotation.document_id!==evidence.document_id||annotation.code_id!==evidence.code_id||source.sha256!==evidence.sha256||annotation.quote!==evidence.quote||annotation.start!==evidence.start||annotation.end!==evidence.end)throw new Error(QT('sourceUnavailable'));
  closeModal();state.project=project;state.docId=source.id;state.view='coding';state.search='';state.codeFilter=null;state.sourceFocus=null;state.networkReturn=null;readingOverviewNav=null;render();
  const mark=[...document.querySelectorAll('.passage mark[data-coding-ids]')].find(el=>JSON.parse(el.dataset.codingIds).includes(annotation.id));
  if(mark){mark.setAttribute('tabindex','-1');mark.scrollIntoView({block:'center'});mark.focus({preventScroll:true});previewCoding([annotation.id]);}
}

let lastTranscriptExport=null;
Object.assign(_T.zh,{writeReport:'撰写／编辑研究报告',ctTitle:'编码原文对照',methodStatusTitle:'方法与报告写作状态',methodStatusNow:'当前支持原文编码、层级、备忘录、描述性计数、图表和编码原文导出。研究报告编辑器可保存、比较和恢复 Analysis Table／Narrative Analysis；三种方法会保存完整名称、对应流程图和各自的人工审核清单。报告可保存最多五张图及可编辑图注、冻结计数和代码，并下载完整 ZIP。',methodStatusPlanned:'Comparative QCA：Insights 内独立的二元校准、真值表、保守配置分析及数据／代码导出。最多 100 案例、6 条件；模糊集等扩展不在范围内。Word 修改不回写 QT。',ctLabels:'树形展示标签',ctSavedLabels:'研究角色／未指定分组',ctResearchLabels:'Theme 主题 → Category 类别 → Code 编码',ctRoleChoice:'已保存研究角色优先。未指定的节点可选结构标签或三层展示预设，不自动形成研究主题，也不改变计数。',ctIntro:'完整正文、精确高亮与已保存的编码树。Group／Code 只描述结构，不自动认定 Theme／Category 角色。',ctScope:'导出文档范围',ctCurrentDoc:'当前文档',ctAll:'全部文档',ctSelected:'选择多份文档',ctFullText:'完整正文，包含未编码语境',ctMemos:'包含文档、标注和编码备忘录',ctPrivate:'文件包含完整访谈正文，请私有保存。不含待采纳建议或阅读标记。',ctHtml:'下载 HTML',ctWord:'下载可编辑 Word',ctChecking:'正在核对旧导出版本…',ctCurrent:'编码证据版本一致。',ctStale:'证据已变化，请重新导出；旧文件保持原样。',ctCheckFailed:'无法核对旧导出，请检查范围并重新导出。',ctCheck:'核对上次导出版本',ctChoose:'请至少选择一份文档。',ctFrozen:'这是正文和编码树的冻结副本，项目编辑不会更新已有文件。'});
function transcriptSelection() {
  const scope=$('#coded-scope').value;
  return scope==='all'?null:scope==='current'?[state.docId]:[...document.querySelectorAll('[name="coded-document"]:checked')].map(el=>el.value);
}
function transcriptParams(format,ids,memos,roles='saved') {
  const query=new URLSearchParams({format,memos:memos?'1':'0'});
  if(ids!==null)ids.forEach(id=>query.append('document_id',id));
  if(roles!=='saved')query.set('role_labels',roles);
  return query.toString();
}
function refreshTranscriptScope() {
  const ids=transcriptSelection(),all=ids===null,chosen=all?state.project.documents:state.project.documents.filter(d=>ids.includes(d.id));
  $('#coded-document-list').hidden=$('#coded-scope').value!=='selected';
  $('#coded-scope-summary').textContent=QT('ctFullText','Full text, including uncoded context')+' · '+chosen.length+' · '+chosen.map(d=>d.name).join(' / ');
  document.querySelectorAll('[data-action="download-coded"]').forEach(button=>button.disabled=!chosen.length);
}
async function checkTranscriptVersion() {
  const output=$('#coded-version-status'),saved=lastTranscriptExport;
  if(!output||!saved||saved.projectId!==state.project.id)return;
  output.textContent=QT('ctChecking','Checking saved export version…');
  try{
    const response=await fetch(projectUrl('export')+'?'+transcriptParams('coded-version',saved.ids,saved.memos,saved.roles),{headers:{'X-QualiCraft-Token':state.token}});
    if(!response.ok)throw new Error('The saved export scope cannot be checked.');
    const data=await response.json();
    if(output.isConnected)output.textContent=saved.filename+' · '+(data.version===saved.version?QT('ctCurrent','Current evidence version.'):QT('ctStale','Evidence changed. Re-export to update; the old file is unchanged.'));
  }catch(_){if(output.isConnected)output.textContent=QT('ctCheckFailed','Could not verify the old export. Check its scope and export again.');}
}
function showExport() {
  const formats=[['json','JSON','exportProjectName','exportProjectUse'],['csv','CSV','exportCodingsName','exportCodingsUse'],['matrix','CSV','exportMatrixName','exportMatrixUse'],['methods','MD','exportMethodsName','exportMethodsUse']];
  modal(QT('exportTitle'),`<p class="io-intro">${QT('exportShort')}</p><button data-action="write-report">${QT('writeReport','Write / edit research report')}</button><p class="reading-marks-help">${QT('markExport','JSON v5 includes project reading marks. Older QT versions cannot open v5. Reading-only changes enter the next research-edit snapshot; export JSON to keep them now.')}</p><div class="option-grid io-export-options">${formats.map(([format,ext,title,use])=>`<button class="option-card io-export-card" data-action="download" data-format="${format}"><span class="io-file-icon" aria-hidden="true">${icon('doc')}<b>${ext}</b></span><span><strong>${QT(title)}</strong><span>${QT(use)}</span></span><span class="io-download-icon" aria-hidden="true">↓</span></button>`).join('')}</div>
    <fieldset class="coded-export"><legend>${QT('ctTitle','Coded transcript')}</legend><p>${QT('ctIntro','Full source text, precise highlights and the saved code tree. Group / Code labels describe structure; Theme / Category roles are not inferred.')}</p><label class="field" for="coded-scope">${QT('ctScope','Documents to export')}<select id="coded-scope">${doc()?`<option value="current">${QT('ctCurrentDoc','Current document')} · ${esc(doc().name)}</option>`:''}<option value="all">${QT('ctAll','All documents')}</option><option value="selected">${QT('ctSelected','Choose documents')}</option></select></label><div id="coded-document-list" class="coded-document-list" hidden>${state.project.documents.map(d=>`<label><input type="checkbox" name="coded-document" value="${esc(d.id)}" ${d.id===state.docId?'checked':''}>${esc(d.name)}</label>`).join('')}</div><p id="coded-scope-summary" class="tiny-label"></p><label class="field" for="coded-roles">${QT('ctLabels','Tree display labels')}<select id="coded-roles"><option value="saved">${QT('ctSavedLabels','Saved roles / unassigned Groups')}</option><option value="theme-category-code">${QT('ctResearchLabels','Theme → Category → Code')}</option></select></label><p class="reading-marks-help">${QT('ctRoleChoice','Saved research roles take precedence. Unassigned nodes use structural labels or the chosen display preset; this does not establish themes or change counts.')}</p><label class="coded-memo-option"><input id="coded-memos" type="checkbox">${QT('ctMemos','Include document, coding and code memos')}</label><p class="tiny-label">${QT('ctPrivate','Contains full interview text. Keep the downloaded files private. Pending suggestions and reading marks are excluded.')}</p><div class="coded-export-actions"><button data-action="download-coded" data-format="coded-html">${QT('ctHtml','Download HTML')}</button><button data-action="download-coded" data-format="coded-docx">${QT('ctWord','Download editable Word')}</button></div><p id="coded-version-status" role="status" aria-live="polite"></p>${lastTranscriptExport?.projectId===state.project.id?`<button class="link" data-action="check-coded-export">${QT('ctCheck','Check previous export version')}</button>`:''}</fieldset><details class="report-status"><summary>${QT('methodStatusTitle','Methods and report writing')}</summary><p>${QT('methodStatusNow','Available: coding, hierarchy, memos, descriptive counts, figures and coded transcripts. The research report editor saves, compares and restores your Analysis Table and Narrative Analysis, with the selected full method name, saved process map and a method-specific review checklist. Save up to five figures with editable captions, frozen counts and code; download the complete report ZIP.')}</p><p>${QT('methodStatusPlanned','Comparative QCA is available in Insights: explicit binary calibration, truth tables, conservative configurations and reproducible export. Up to 100 cases and six conditions; fuzzy and other extensions are outside this implementation. Word edits do not update QT.')}</p></details><div id="export-result" class="io-export-result" role="status" aria-live="polite"><div class="io-result-empty">${icon('down')}<span>${QT('exportChoose')}</span></div></div><p class="io-privacy">${QT('exportPrivate')}</p>`);
  $('#dialog').dataset.workflow='export';
  refreshTranscriptScope();
  if(lastTranscriptExport?.projectId===state.project.id)checkTranscriptVersion();
}
function exportResultHtml(filename,bytes,text) {
  const excerpt=cp(text.split('\n').slice(0,8).join('\n')).slice(0,1000).join('');
  return `<div class="io-result-heading">${icon('doc')}<div><span class="io-kicker">${QT('exportSent')}</span><strong data-export-filename>${esc(filename)}</strong><span>${bytes.toLocaleString()} B</span></div><span class="io-result-check" aria-hidden="true">✓</span></div><p>${QT('exportCheck')}</p><details class="io-export-preview"><summary>${QT('exportPreview')}</summary><pre>${esc(excerpt)}</pre></details>`;
}
async function createProject(body, rawJson=false) {
  // Restore the original text: parsing/stringifying here changes 1.0 to 1 and
  // invalidates existing frozen report/QCA hashes. The server still validates.
  const p=await api(rawJson?'/api/projects/restore':'/api/projects',body,{rawJson}); state.projects=await api('/api/projects');
  if(!rawJson&&['empty','bologna'].includes(body.kind))setGuidePreference(p.id,'active');
  closeModal(); state.view='coding'; await loadProject(p.id,p); toast(QT('projectCreated','Project created and saved locally.'));
}
async function action(button) {
  const a=button.dataset.action;
  if(a==='inspect-code'){selectInspectorCode(button.dataset.id);return;}
  if(a==='inspect-paragraph'){const start=Number(button.dataset.start),p=segments(doc().text).find(p=>p.start===start);if(p)inspectCodings(state.project.annotations.filter(a=>a.document_id===state.docId&&a.start<p.end&&a.end>p.start).map(a=>a.id));return;}
  if(a==='inspect-return'||a==='inspect-close'){finishCodingInspection(false);return;}
  if(a==='inspect-here'){finishCodingInspection(true);return;}
  if(a==='inspect-prev'||a==='inspect-next'){const items=inspectorMatches();codingInspector.index=Math.max(0,Math.min(items.length-1,codingInspector.index+(a==='inspect-next'?1:-1)));refreshInspector();focusInspectorSource();return;}
  if(a==='inspect-filter'){beginCodingInspection();state.codeFilter=button.dataset.id;readingOverviewNav=null;readingOverviewFocus=null;render();if(!inspectorWide())openCodingInspector(false);return;}
  if(a==='inspect-show-all'){state.search='';state.codeFilter=null;render();if(!inspectorWide())openCodingInspector(false);focusInspectorSource();return;}
  if(a==='inspect-ai'||a==='inspect-tree'){if(a==='inspect-ai')beginCodingInspection();codingInspector.mode=a==='inspect-ai'?'ai':'tree';refreshInspector();return;}
  if(a==='write-report')return openResearchReport();
  if(a==='open-qca')return window.QTQCA.open({project:state.project,lang:QT_LANG,readonly:state.config.public_demo,request:api,endpoint:projectUrl(),modal,onSaved:refresh,onReport:()=>openResearchReport('comparative'),fetchFile:url=>fetch(url,{headers:{'X-QualiCraft-Token':state.token}})});
  if(a==='check-coded-export')return checkTranscriptVersion();
  if(a==='download-coded'){
    const ids=transcriptSelection();if(ids!==null&&!ids.length)throw new Error(QT('ctChoose','Choose at least one document.'));
    const memos=$('#coded-memos').checked,roles=$('#coded-roles').value,projectId=state.project.id,result=$('#export-result');
    button.disabled=true;result.textContent=QT('exportPreparing');
    try{
      const response=await fetch(projectUrl('export')+'?'+transcriptParams(button.dataset.format,ids,memos,roles),{headers:{'X-QualiCraft-Token':state.token}});
      if(!response.ok)throw new Error((await response.json()).error||'Export failed.');
      const blob=await response.blob(),version=response.headers.get('X-QT-Evidence-Version'),filename='qt-coded-transcript-'+version.slice(0,12)+(button.dataset.format==='coded-html'?'.html':'.docx');
      const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      lastTranscriptExport={projectId,ids,memos,roles,version,filename};
      if(result.isConnected)result.innerHTML=exportResultHtml(filename,blob.size,'Evidence SHA256 '+version+'\n'+QT('ctFrozen','Frozen source and coding tree. Existing files do not update after editing.'));
      toast(QT('exportSent')+': '+filename);
    }catch(error){if(result.isConnected)result.textContent='';throw error;}
    finally{if(button.isConnected)refreshTranscriptScope();}
    return;
  }
  if(state.config.public_demo&&WRITE_ACTIONS.has(a)){toast(DEMO_LOCK(),true);return;}
  if(a==='documents'){ioReturnFocus=null;return showDocumentManager(button);}
  if(a==='documents-done'){finishDocumentManager();return;}
  if(a==='document-recovery'){
    const session=documentManager;if(!session||session.busy||session.loading)return;
    session.busy=true;
    try{const backups=await api(`/api/projects/${session.projectId}/backups`);if(!documentManagerActive(session))return;state.backups=backups.items;state.backupStatus=backups.status;showSnapshots(`<button data-action="document-recovery-back">← ${dmText('Manage documents','管理文档')}</button>`);$('#dialog').dataset.workflow='documents-recovery';}
    finally{session.busy=false;}return;
  }
  if(a==='document-recovery-back'){renderDocumentManager();return;}

  if(a==='document-view'){const id=button.dataset.id;finishDocumentManager();switchReadingDocument(id);return;}
  if(a==='document-remove-review')return reviewDocumentRemoval(button.dataset.id);
  if(a==='document-remove-cancel'){if(!documentManager?.busy){documentManager.review=null;renderDocumentManager();}return;}
  if(a==='document-remove-confirm')return confirmDocumentRemoval();
  if(a==='close'&&$('#dialog').dataset.workflow?.startsWith('documents')){finishDocumentManager();return;}
  if(a==='close'){if($('#dialog').dataset.workflow==='coding-inspector')finishCodingInspection(false);else closeModal();return;}
  if(a==='workspace-home'){closeModal();showWorkspaceStart();return;}
  if(a==='start-project'){startReturnFocus=button;showStartProject();return;}
  if(a==='start-create'){await createProject({name:$('#new-project-name').value,kind:'empty'});showImport();return;}
  if(a==='bologna-project')return createProject({kind:'bologna'});
  if(a==='open-project'){await loadProject(button.dataset.id);return;}
  if(a==='start-open'){const id=$('#start-project-select').value;if(id)await loadProject(id);return;}
  if(a==='guide-examples'){$('#start-project-select')?.focus();return;}
  if(a==='guide-open'){openGuide(button);return;}
  if(a==='guide-dismiss'){dismissGuide();return;}
  if(a==='guide-back'||a==='guide-next'){
    const step=guide.step??guideCurrentStep(state.project);
    if(a==='guide-next'&&step===2){dismissGuide();return;}
    guide.step=Math.max(0,Math.min(2,step+(a==='guide-next'?1:-1)));setGuidePreference(state.project?.id||null,'active',guide.step);updateGuide();$('#guide-title')?.focus({preventScroll:true});return;
  }
  if(a==='guide-source'){if(!doc()){if(!state.config.public_demo)showImport();return;}state.view='coding';render();scrollReadingParagraph(0,true);return;}
  if(a==='guide-map'){state.view='insights';state.insightsTab='map';render();return;}

  if(a==='insights-tab'){state.insightsTab=button.dataset.tab;render();document.querySelector(`[data-action="insights-tab"][data-tab="${state.insightsTab}"]`)?.focus();return;}
  if(a==='net-prev'||a==='net-next'){stepNetworkSelection(a==='net-prev'?-1:1);return;}
  if(a==='net-passages'){toggleNetworkPassages();return;}
  if(a==='net-clear'){clearNetworkSelection();document.getElementById('network-next')?.focus();return;}
  if(a==='net-evidence'){NET.evidenceId=button.dataset.id;drawNetworkEvidence();document.querySelector('[data-action="net-locate"]')?.focus();return;}
  if(a==='net-locate'){openNetworkSource(button.dataset.id);return;}
  if(a==='net-return'){returnToNetwork();return;}
  if(a==='net-dismiss'){state.sourceFocus=null;state.networkReturn=null;render();return;}
  if(a==='view'){state.view=button.dataset.view;state.selection=null;render();if(state.view==='plotting')document.getElementById('figures-heading')?.focus({preventScroll:true});return;}
  if(a==='doc'){switchReadingDocument(button.dataset.id);return;}
  if(a==='reading-overview'){button.disabled=false;toggleReadingOverview();return;}
  if(a==='overview-select-paragraph'){selectReadingOverviewParagraph(Number(button.dataset.index));return;}
  if(a==='overview-find-paragraph'){const input=$('#overview-paragraph-number');if(input.reportValidity())selectReadingOverviewParagraph(Number(input.value)-1);return;}
  if(a==='overview-select-source'||a==='overview-find-source'){
    const data=readingOverviewData(state.project,doc()),p=data.paragraphs[readingOverview.paragraph],scope=readingOverview.sourceScope==='paragraph'&&p?data.ranges.filter(g=>g.start<p.end&&g.end>p.start):data.ranges;
    const input=$('#overview-range-number');if(a==='overview-find-source'&&!input.reportValidity())return;
    const group=a==='overview-select-source'?data.ranges.find(g=>g.key===button.dataset.key):scope[Number(input.value)-1];
    if(group){readingOverview.rangeKey=group.key;readingOverview.sourcePage=Math.floor(scope.indexOf(group)/10);if(readingOverview.sourceScope==='document'){const first=data.paragraphs.find(p=>p.start<group.end&&p.end>group.start);if(first){readingOverview.paragraph=first.index;readingOverview.paragraphPage=Math.floor(first.index/12);}}renderReadingOverview();const detail=$('.overview-source-detail h3');detail?.scrollIntoView({block:'center',behavior:'instant'});detail?.focus({preventScroll:true});}return;
  }
  if(a==='overview-page'){const kind=button.dataset.kind;readingOverview[kind==='paragraph'?'paragraphPage':'sourcePage']=Number(button.dataset.page);renderReadingOverview();return;}
  if(a==='overview-jump-paragraph'||a==='overview-jump-source'||a==='overview-show-full'){jumpReadingOverview(a==='overview-show-full');return;}
  if(a==='overview-keep'){keepOverviewPosition();return;}
  if(a==='reading-mark-read')return saveReadingMark('read');
  if(a==='reading-mark-undo'){const saved=readingUndos.get(markKey(state.project.id,doc().id));if(saved)return saveReadingMark(saved.status,{undo:true,targetOverride:saved});return;}
  if(a==='reading-mark-retry'){const failure=readingFailures.get(markKey(state.project.id,doc().id));if(failure?.retry?.refresh)return refreshReadingMarks(failure.retry.projectId,failure.retry.documentId);if(failure?.retry)return saveReadingMark(failure.retry.body.status,{retry:failure.retry,reset:failure.retry.reset,undo:failure.retry.undo});return;}
  if(a==='reading-mark-reset'){if(confirm(QT('markResetConfirm','The source has changed. Clear these project reading marks and bind new marks to this text? A recovery snapshot will be checked first.')))return saveReadingMark('unmarked',{reset:true});return;}
  if(a==='reading-resume'){resetCodingInspector();readingOverviewNav=null;readingOverviewFocus=null;readingOverview.open=false;const saved=readReadingPosition(state.project,doc());if(saved){state.search='';state.codeFilter=null;state.sourceFocus=null;render();scrollReadingParagraph(saved.start,true);updateReadingPosition();}return;}
  if(a==='reading-tools'){const pane=$('#document-pane'),open=pane.classList.toggle('reading-tools-open');button.setAttribute('aria-expanded',String(open));return;}
  if(a==='coding-codebook')return showMobileCodebook();
  if(a==='filter-code'){const inBook=button.closest('#mobile-codebook-list');const fromTree=button.closest('.codebook-tree'),id=button.dataset.id;if(inBook){delete $('#dialog').dataset.codingCodebook;closeModal();}readingOverviewNav=null;readingOverviewFocus=null;state.codeFilter=state.codeFilter===button.dataset.id?null:button.dataset.id;state.view='coding';render();if(inBook)$('.reader-code-filter button')?.focus();else if(fromTree)[...document.querySelectorAll('#side-list [data-action="filter-code"]')].find(el=>el.dataset.id===id)?.focus({preventScroll:true});return;}
  if(a==='toggle-code'){const id=button.dataset.id;state.collapsed.has(id)?state.collapsed.delete(id):state.collapsed.add(id);refreshCodebooks(id,'toggle-code',button.closest('#inspector-tree')?'inspector':button.closest('#mobile-codebook-list')?'mobile':'side');return;}
  if(a==='toggle-codebook'){state.codebookOpen=!state.codebookOpen;refreshSideList();$('[data-action="toggle-codebook"]')?.focus({preventScroll:true});return;}
  if(a==='code-edit'){showCodeEdit(button.dataset.id);$('#dialog').dataset.codingEdit=button.dataset.id;return;}
  if(a==='code-delete-ask')return showCodeDeleteAsk(button.dataset.id);
  if(a==='code-merge-ask')return showMergeAsk(button.dataset.id);
  if(a==='clear-filter'){state.codeFilter=null;state.search='';render();$('#reading-document')?.focus({preventScroll:true});return;}
  if(a==='import')return showImport();
  if(a==='code')return showCode();
  if(a==='tools')return showTools();
  if(a==='enable-all-blocks'){
    // This project-specific preset unions its tools with the current settings.
    // It does not change new-project defaults or the AI/memo block settings.
    const current = Array.isArray(state.project.blocks) ? state.project.blocks : [];
    const wanted = [...new Set([...current, 'hierarchy', 'insights', 'plotting', 'audit'])];
    await api(projectUrl('blocks'), {blocks: wanted});
    await refresh();
    toast(QT('blocksEnabled','Figure workflow enabled for this project.'));return;
  }
  if(a==='save-blocks'){
    const picked=[...document.querySelectorAll('#dialog .brick.on')].map(x=>x.dataset.block);
    await api(projectUrl('blocks'),{blocks:picked});
    if(!picked.includes(state.view)&&state.view!=='coding')state.view='coding';
    closeModal();await refresh();
    toast(QT('blocksUpdated','Capability blocks updated.'));return;
  }
  if(a==='toggle-motion') {
    motionPreference=motionPreference==='reduce'?'system':'reduce';
    try {localStorage.setItem('qualicraft-motion',motionPreference);} catch(e) {}
    applyMotionPreference();
    if(networkReducedMotion()) { if(NET.frame) cancelAnimationFrame(NET.frame); NET.frame=0; NET.alpha=0; drawNetwork(); }
    button.textContent=motionLabel();button.setAttribute('aria-pressed',String(motionPreference==='reduce'));return;
  }
  if(a==='settings')return showSettings();
  if(a==='projects')return showProjects();
  if(a==='export')return showExport();
  if(a==='annotate'){if(popupWriteBusy)return;const selected=$('#code-popup')?popupSelectedCode():null;closeCodePopup();return showAnnotation(selected);}
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
  if(a==='import-mode')return setImportMode(button.dataset.mode);
  if(a==='queue-open'){showImportQueue();return;}
  if(a.startsWith('queue-')){
    const q=activeImportQueue;if(!q||q.projectId!==state.project?.id)return;
    if(a==='queue-start')return q.run();
    if(a==='queue-pause'){q.pause();return;}
    if(a==='queue-clear'){q.clearFinished();return;}
    if(a==='queue-cancel'){q.cancel(button.dataset.id);return;}
    if(a==='queue-retry'){q.retry(button.dataset.id);return q.run();}
    if(a==='queue-keep'){q.keep(button.dataset.id);return q.run();}
    if(a==='queue-view'){const id=button.dataset.id,pid=q.projectId;closeModal();await refreshImportedProject(pid);if(state.project?.id===pid){importedDocument(id);render();focusImportedDocument();}return;}
  }
  if(a==='save-document'||a==='keep-document')return saveDocument(a==='keep-document');
  if(a==='save-code'){await saveCoding('codes',{name:$('#code-name').value,definition:$('#code-definition').value,color:$('#code-color').value,parent_id:$('#code-parent')?$('#code-parent').value||null:null,research_role:$('#code-role').value||null});closeModal();render();toast(QT('codeSaved','Code saved.'));return;}
  if(a==='code-save'){
    const id=button.dataset.id;
    const changes=codeEditChanges(codeEditValues(),$('#dialog').codeEditBaseline);
    if(Object.keys(changes).length)await saveCoding('code-update',{id,changes});
    closeModal();render();toast(QT('codeUpdated','Code updated.'));return;
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
  if(a==='save-annotation'){if(!state.project.codes.some(c=>c.id===$('#annotation-code').value))throw Error(QT('selectCode','Select a code'));await saveCoding('annotations',{...state.selection,code_id:$('#annotation-code').value,memo:$('#annotation-memo').value});state.selection=null;closeModal();render();toast(QT('passageCoded','Passage coded.'));return;}
  if(a==='review'){const start=state.project.suggestions.find(s=>s.id===button.dataset.id)?.start;await api(projectUrl('review'),{id:button.dataset.id,action:button.dataset.decision});await refresh();locate(start);toast(button.dataset.decision==='accept'?QT('toastAccepted','Accepted and added to your codings.'):QT('toastRejected','Rejected; review decision saved.'));return;}
  if(a==='coding-locate'){const id=button.dataset.id;delete $('#dialog').dataset.codingId;closeModal();if(state.search||state.codeFilter){state.search='';state.codeFilter=null;render();}const mark=[...document.querySelectorAll('.passage mark[data-coding-ids]')].find(el=>JSON.parse(el.dataset.codingIds).includes(id));if(mark){mark.setAttribute('tabindex','-1');mark.scrollIntoView({block:'center',behavior:'auto'});mark.focus({preventScroll:true});previewCoding([id]);}return;}
  if(a==='annotation'&&state.view==='coding'){inspectCodings([button.dataset.id]);return;}
  if(a==='annotation'||a==='inspect-edit-coding'){
    const annotation=state.project.annotations.find(x=>x.id===button.dataset.id);
    previewCoding([annotation.id]);
    modal(codesFor(annotation).name,`${codingDetailsHtml(annotation)}<label class="field">${QT('researchMemo','Research memo')}<textarea id="edit-memo" rows="4">${esc(annotation.memo)}</textarea></label>`,`<button class="danger" data-action="remove-annotation"${demoLock()} data-id="${annotation.id}">${QT('removeCoding','Remove coding')}</button><button class="primary" data-action="save-memo"${demoLock()} data-id="${annotation.id}">${QT('saveMemo','Save memo')}</button>`);
    $('#dialog').dataset.codingId=annotation.id;return;
  }
  if(a==='save-memo'){await saveCoding('memo',{id:button.dataset.id,memo:$('#edit-memo').value});closeModal();render();toast(QT('memoSaved','Memo saved.'));return;}
  if(a==='remove-annotation'){await saveCoding('remove-annotation',{id:button.dataset.id});closeModal();render();toast(QT('codingRemoved','Coding removed; the previous record is retained in the audit trail.'));return;}
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
  if(a==='plot-view')return showPlotViewer(button);
  if(a==='plot-generate')return generatePlotPreview();
  if(a==='plot-export')return exportPlotBundle();
  if(a==='enable-figures'){await api(projectUrl('blocks'),{blocks:[...new Set([...(state.project.blocks||[]),'plotting'])]});await refresh();return;}
  if(a==='download'){
    const result=$('#export-result');
    if(result){result.textContent=QT('exportPreparing');$('#modal-error').textContent='';}
    try {
    const format=button.dataset.format,response=await fetch(projectUrl('export')+'?format='+format,{headers:{'X-QualiCraft-Token':state.token}});
    if(!response.ok){if(result?.isConnected)result.textContent='';throw new Error('Export failed.');}
    const blob=await response.blob(),filename='qualicraft-'+(format==='json'?'project.json':format==='methods'?'methods.md':format+'.csv');
    const text=await blob.text(),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    if(result?.isConnected)result.innerHTML=exportResultHtml(filename,blob.size,text);
    toast(QT('exportSent')+': '+filename);return;
    }catch(error){if(result?.isConnected)result.textContent='';throw error;}
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
  clearTimeout(pollTimer);pollTimer=setTimeout(async()=>{try{const before=state.jobs.filter(j=>j.status==='running').map(j=>j.id);state.jobs=await api('/api/jobs');renderJob();const finished=state.jobs.find(j=>before.includes(j.id)&&j.status!=='running');if(finished){if(finished.project_id===state.project?.id)await refresh();toast(finished.error||'Analysis finished. Review your suggestions.',finished.status==='failed');}if(state.jobs.some(j=>j.status==='running'))startPolling();}catch(e){toast('Could not read task status. Refresh to view saved results.',true);}},1500);
}
document.addEventListener('click',async e=>{const button=e.target.closest('[data-action]');if(!button||button.disabled)return;if(['import','export'].includes(button.dataset.action))ioReturnFocus=button;button.disabled=true;try{await action(button);}catch(error){errorDisplay(error);}finally{if(button.isConnected){button.disabled=button.dataset.action==='start-analysis'&&!$('#send-confirm')?.checked;if(button.dataset.action==='document-remove-confirm')syncRemovalConfirm();if(button.dataset.action.startsWith('net-'))drawNetworkControls();if(button.dataset.action.startsWith('queue-')&&activeImportQueue)renderImportQueue(activeImportQueue);}}});
document.addEventListener('close',e=>{if(e.target.id==='dialog'&&e.target.dataset.workflow&&ioReturnFocus?.isConnected&&!ioReturnFocus.disabled)ioReturnFocus.focus({preventScroll:true});},true);
document.addEventListener('click',e=>{
  const brick=e.target.closest('.brick'); if(!brick) return;
  const on=brick.classList.toggle('on');
  brick.setAttribute('aria-pressed',String(on));
  const state_=brick.querySelector('.brick-state'); if(state_) state_.textContent=on?QT('added','Added'):QT('add','Add');
});
document.addEventListener('cancel',e=>{if(e.target.id==='dialog'){pauseImportQueue();if(e.target.dataset.workflow?.startsWith('documents')){e.preventDefault();finishDocumentManager();}}},true);
document.addEventListener('close',e=>{if(e.target.id==='dialog'&&!e.target.open){pauseImportQueue();documentImport=null;}},true);
document.addEventListener('change',async e=>{
  if(e.target.id==='coded-scope'||e.target.name==='coded-document'){refreshTranscriptScope();return;}
  if(e.target.dataset&&e.target.dataset.plot){changePlotOption(e.target);return;}

  try{
    if(['queue-add-files','queue-reselect-files'].includes(e.target.id)){
      const q=activeImportQueue;if(!q)return;
      if(e.target.id==='queue-reselect-files'){const n=q.attach(Array.from(e.target.files));toast(n?`${n} ${QT('queueReselected','files reselected. Start / resume to continue.')}`:QT('queueNoMatch','No queued filenames matched. Reselect the original files.'));}
      else q.add(Array.from(e.target.files));
      e.target.value='';return;
    }
    if(e.target.id==='import-file'&&e.target.files.length>1){
      const files=Array.from(e.target.files);e.target.value='';resetImportDecision();updateImportPreview();
      showImportQueue(files);return;
    }
    if(e.target.dataset?.queueName){activeImportQueue?.rename(e.target.dataset.queueName,e.target.value);return;}
    if(e.target.id==='import-file'){resetImportDecision();if(!e.target.files[0]){document.querySelector('[data-file-name="import-file"]').textContent=QT('noFileSelected');await updateImportPreview();}}
    if(e.target.id==='network-select'){if(!e.target.value)clearNetworkSelection();else if(NET.selected!==e.target.value)toggleNetworkNode(e.target.value);return;}
    if(e.target.id==='start-project-select')$('[data-action="start-open"]').disabled=!e.target.value;
    if(e.target.id==='annotation-code'){const match=codePopupMatches('').find(m=>m.code.id===e.target.value);$('#annotation-code-path').textContent=match?.identity||'';$('[data-action="save-annotation"]').disabled=!match;return;}
    if(e.target.id==='reading-document'){switchReadingDocument(e.target.value);return;}
    if(e.target.id==='project-select')await loadProject(e.target.value);
    if(e.target.id==='review-filter'){state.reviewFilter=e.target.value;refreshInspector();}
    if(e.target.id==='send-confirm')$('[data-action="start-analysis"]').disabled=!e.target.checked;
    if(e.target.matches('input[type="file"]')&&e.target.files[0]){const label=document.querySelector('[data-file-name="'+e.target.id+'"]');if(label)label.textContent=e.target.files[0].name;if(e.target.id==='import-file'){$('#document-name').value=e.target.files[0].name.replace(/\.(txt|docx)$/i,'');await updateImportPreview();}}
    if(e.target.id==='restore-file'&&e.target.files[0]){if(!e.target.files[0].size)throw new Error('The project file is empty.');if(e.target.files[0].size>20_000_000)throw new Error('Project file exceeds 20 MB.');await createProject(await e.target.files[0].text(),true);}
  }catch(error){errorDisplay(error);}
});
document.addEventListener('input',e=>{if(e.target.id==='document-remove-confirm'){syncRemovalConfirm();return;}if(e.target.id==='manage-document-search'){documentManager.query=e.target.value;$('#managed-document-list').innerHTML=managedDocumentRows();return;}if(e.target.id==='inspector-search'){codingInspector.query=e.target.value;const tree=$('#inspector-tree');if(tree)tree.innerHTML=codebookHtml('inspector');return;}if(['document-name','document-text'].includes(e.target.id))resetImportDecision();if(e.target.id==='mobile-code-filter'){state.sideFilter=e.target.value;refreshSideList();$('#mobile-codebook-list').innerHTML=codebookHtml('mobile');}else if(e.target.id==='search'){beginReadingSearch();readingOverviewNav=null;readingOverviewFocus=null;state.search=e.target.value;state.selection=null;closeCodePopup();$('#reader').innerHTML=readerHtml();mountReading(!state.search);}else if(e.target.id==='side-filter'){state.sideFilter=e.target.value;refreshSideList();}});
// Preview changes CSS only: no re-render, source text insertion or server write.
document.addEventListener('click',event=>{const mark=event.target.closest?.('#reader mark[data-coding-ids]');if(!mark||window.getSelection?.()?.toString())return;inspectCodings(JSON.parse(mark.dataset.codingIds));});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&$('#dialog').open&&$('#dialog').dataset.workflow?.startsWith('documents')){event.preventDefault();finishDocumentManager();return;}
 const mark=event.target.closest?.('#reader mark[data-coding-ids]');if(mark&&['Enter',' '].includes(event.key)){event.preventDefault();inspectCodings(JSON.parse(mark.dataset.codingIds));return;}
 if(event.key==='Escape'&&inspectorReturn()&&!$('#dialog').open&&!$('#code-popup')){event.preventDefault();finishCodingInspection(false);}
});
document.addEventListener('cancel',event=>{if(event.target.id==='dialog'&&event.target.dataset.workflow==='coding-inspector'){event.preventDefault();finishCodingInspection(false);}},true);
document.addEventListener('close',event=>{if(event.target.id==='dialog'&&codingInspector.drawer&&!inspectorWide()&&state.project&&state.view==='coding'){queueMicrotask(()=>{if(!$('#dialog').open&&codingInspector.drawer)openCodingInspector(false);});}},true);
document.addEventListener('pointerover',event=>{
  if(event.pointerType!=='mouse')return;
  const pill=event.target.closest('.pill[data-code-id]'),mark=event.target.closest('.passage mark[data-coding-ids]');
  if(pill)previewCoding([pill.dataset.id]);else if(mark)previewCoding(JSON.parse(mark.dataset.codingIds));
});
document.addEventListener('pointerout',event=>{
  if(event.target.closest('.pill[data-code-id],.passage mark[data-coding-ids]')&&!event.relatedTarget?.closest('.pill[data-code-id],.passage mark[data-coding-ids]')){
    const focused=document.activeElement?.closest('.pill[data-code-id]');previewCoding(focused?[focused.dataset.id]:[]);
  }
});
document.addEventListener('focusin',event=>{const pill=event.target.closest('.pill[data-code-id]');if(pill)previewCoding([pill.dataset.id]);});
document.addEventListener('focusout',event=>{if(event.target.closest('.pill[data-code-id]')&&!event.relatedTarget?.closest('.pill[data-code-id]'))previewCoding();});
document.addEventListener('keydown',handleCodebookKey);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('#dialog').open&&document.activeElement?.closest('.quick-guide')){event.preventDefault();dismissGuide();}});
document.addEventListener('close',event=>{if(event.target.id==='dialog'&&event.target.dataset.startup&&startReturnFocus?.isConnected)startReturnFocus.focus({preventScroll:true});},true);
document.addEventListener('close',event=>{
  if(event.target.id!=='dialog')return;
  const edit=event.target.dataset.codingEdit;if(edit){const button=[...document.querySelectorAll('.codebook-tree [data-action="code-edit"]')].find(el=>el.dataset.id===edit);(button||document.querySelector('[data-action="coding-codebook"]'))?.focus({preventScroll:true});}
  const id=event.target.dataset.codingId;
  if(id){const button=[...document.querySelectorAll('.pill')].find(el=>el.dataset.id===id);button?.focus({preventScroll:true});previewCoding(button?[id]:[]);}
  if(event.target.dataset.codingCodebook)document.querySelector('[data-action="coding-codebook"]')?.focus({preventScroll:true});
},true);
const docMemoTimers=new Map();
document.addEventListener('input',e=>{
  if(e.target.id!=='doc-memo')return;
  const projectId=state.project.id,documentId=state.docId,value=e.target.value,document=doc();
  if(document)document.memo=value;
  const badge=$('#doc-memo-state');if(badge)badge.textContent='…';
  const key=readingKey(projectId,documentId);clearTimeout(docMemoTimers.get(key));
  docMemoTimers.set(key,setTimeout(async()=>{
    docMemoTimers.delete(key);
    const target=state.project.id===projectId&&state.docId===documentId?$('#doc-memo-state'):null;
    try{
      await api(`/api/projects/${projectId}/document-update`,{id:documentId,changes:{memo:value}});
      if(target?.isConnected){target.textContent='saved';setTimeout(()=>{if(target.isConnected)target.textContent='';},1600);}
    }catch(error){if(target?.isConnected)target.textContent='not saved';}
  },900));
});
document.addEventListener('mouseup',e=>{if(e.target.closest('#reader'))selectionUpdate();});
document.addEventListener('keyup',e=>{if(e.shiftKey&&e.target.closest('#reader'))selectionUpdate();});
document.addEventListener('mousedown',e=>{if(!e.target.closest('#code-popup')&&!e.target.closest('#reader')&&!e.target.closest('dialog'))closeCodePopup();});
window.addEventListener('scroll',()=>positionCodePopup(),true);
let inspectorWasWide=inspectorWide();
window.addEventListener('resize',onCodingWindowResize);
window.addEventListener('scroll',scheduleReadingPosition,true);
window.addEventListener('pagehide',rememberReadingWindow);
window.addEventListener('blur',rememberReadingWindow);
window.addEventListener('focus',()=>{if(readingWindowRestore)restoreReadingWindow();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')rememberReadingWindow();else if(readingWindowRestore)restoreReadingWindow();});
async function init(){try{
  const boot=await api('/api/bootstrap');state.token=boot.token;state.projects=boot.projects;state.config=boot.config;
  const id=selectedStartupProject(state.projects,state.config.public_demo,state.config.hosted);if(id)await loadProject(id);else render();
  state.jobs=await api('/api/jobs');renderJob();if(state.jobs.some(j=>j.status==='running'))startPolling();
}catch(error){$('#app').innerHTML=`<div class="loading">Could not open workspace: ${esc(error.message)}. Check that the local server is running, then refresh.</div>`;}}
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
  projectKey:null, evidenceId:null, restoreFocus:false,
};

/* A fixed logical canvas, scaled to fit by preserveAspectRatio. Reading the
   rendered size to build the viewBox is circular — the content widens the
   element, the wider element widens the next viewBox — and it ran away to
   23,000px before anyone noticed. */
const NET_VIEW = { w: 1000, h: 560 };
const NET_RADIUS = { theme: 26, code: 13, passage: 4.5 };
const NET_FILL = { theme: '#33465c', code: '#5b7ba6', passage: '#c8cfd8' };

async function loadNetwork() {
  if (NET.frame) cancelAnimationFrame(NET.frame);
  NET.frame = 0; NET.svg = null; NET.drag = null;
  const stage = document.getElementById('network-stage');
  if (!stage) return;
  const key = state.project.id + ':' + state.project.updated_at;
  try {
    const fresh = NET.projectKey !== key;
    if (fresh) {
      const graph = await api(projectUrl('network'));
      // A slow response must not overwrite another view or project.
      if (document.getElementById('network-stage') !== stage || key !== state.project.id + ':' + state.project.updated_at) return;
      NET.nodes = graph.nodes.map(n=>({...n,x:0,y:0,vx:0,vy:0,hint:n.kind==='passage'?(n.case+' · ['+n.start+', '+n.end+') · '+n.label):networkCodePath(n.code_id||n.theme_id)}));
      NET.links = graph.links;
      NET.index = new Map(NET.nodes.map(n=>[n.id,n]));
      NET.visible = new Set(graph.nodes.filter(n=>n.kind!=='passage').map(n=>n.id));
      NET.expanded = new Set(); NET.selected = null; NET.evidenceId = null;
      NET.levels = graph.levels; NET.projectKey = key;
      seedNetwork();
    }
    stage.innerHTML = '<svg id="network-svg" role="img" aria-describedby="network-key-help network-selection" aria-label="' + esc(QT('network','Relationship map')) + '"></svg>';
    NET.svg = document.getElementById('network-svg');
    const picker = document.getElementById('network-select');
    picker.innerHTML = '<option value="">' + esc(QT('selectNetwork')) + '</option>'
      + ['theme','code'].map(kind=>'<optgroup label="'+esc(kind==='theme'?QT('themes','Themes'):QT('codes','Codes'))+'">'
        + NET.nodes.filter(n=>n.kind===kind).map(n=>'<option value="'+esc(n.id)+'">'+esc(n.label)+'</option>').join('')+'</optgroup>').join('');
    picker.disabled = false;
    drawNetwork(); drawNetworkLegend(); drawNetworkEvidence();
    if (fresh) wakeNetwork();
    else if (NET.alpha >= 0.02 && !networkReducedMotion()) NET.frame = requestAnimationFrame(tickNetwork);
  } catch (error) {
    if (document.getElementById('network-stage') !== stage) return;
    stage.innerHTML = '<div class="network-empty">' + esc(error.message) + '</div>';
    document.getElementById('network-evidence').innerHTML = '<p>' + esc(error.message) + '</p>';
  }
}

// Source identity comes from saved annotation IDs and Unicode character ranges.
// Names, graph previews and a matching substring cannot identify a source.
function evidenceRecord(id) {
  const annotation = state.project.annotations.find(a=>a.id===id);
  if (!annotation) return null;
  const code = state.project.codes.find(c=>c.id===annotation.code_id);
  const document = state.project.documents.find(d=>d.id===annotation.document_id);
  const {start,end,quote} = annotation;
  const valid = !!(code && document && Number.isInteger(start) && Number.isInteger(end)
    && start>=0 && start<end && end<=cp(document.text).length && cut(document.text,start,end)===quote);
  return {annotation,code,document,valid};
}
function networkPassageEvidence(node) {
  const record = evidenceRecord(node.annotation_id);
  if (!record?.valid) return null;
  const a = record.annotation;
  return a.document_id===node.document_id && a.code_id===node.code_id && a.start===node.start && a.end===node.end ? a : null;
}
function networkEvidenceRows() {
  const node = NET.index.get(NET.selected);
  if (!node) return [];
  const ids = node.kind==='theme' ? new Set([node.theme_id,...codeDescendants(node.theme_id)]) : new Set([node.code_id]);
  return state.project.annotations.filter(a=>ids.has(a.code_id));
}
function networkCodePath(id) {
  const code=state.project.codes.find(c=>c.id===id);
  return code?codePath(code):id;
}
function networkSourceCount(rows) {
  return new Set(rows.map(a=>JSON.stringify([a.document_id,a.start,a.end]))).size;
}
function sameSourceCodings(annotation) {
  const ids=new Set(state.project.codes.map(c=>c.id));
  return state.project.annotations.filter(a=>ids.has(a.code_id)&&a.document_id===annotation.document_id&&a.start===annotation.start&&a.end===annotation.end);
}
function networkRangeHtml(annotation) {
  const related=sameSourceCodings(annotation);
  return `<div class="network-range-codings"><p>${QT('oneRange')} · ${related.length} ${QT('rangeCodings')}</p><ul aria-label="${QT('allRangeCodings')}">${related.map(a=>`<li>${esc(networkCodePath(a.code_id))}</li>`).join('')}</ul></div>`;
}
function networkEvidenceHtml() {
  const node = NET.index.get(NET.selected);
  if (!node) return `<h3>${QT('evidenceTitle')}</h3><p>${QT('evidenceHint')}</p>`;
  const rows = networkEvidenceRows(), record = evidenceRecord(NET.evidenceId);
  const chosen = record && rows.some(a=>a.id===record.annotation.id) ? record : null;
  const path = networkCodePath(node.kind==='theme'?node.theme_id:node.code_id);
  const detail = chosen ? `<div class="network-detail"><h4>${QT('fullQuote')}</h4><blockquote tabindex="0" aria-label="${QT('fullQuote')}">${esc(chosen.annotation.quote)}</blockquote><dl><dt>${QT('documentLabel','DOCUMENT')}</dt><dd>${esc(chosen.document?.name||chosen.annotation.document_id)}</dd><dt>${QT('codes','Codes')}</dt><dd>${esc(networkCodePath(chosen.annotation.code_id))}</dd><dt>${QT('sourceLocation')}</dt><dd>[${chosen.annotation.start}, ${chosen.annotation.end})</dd></dl>${networkRangeHtml(chosen.annotation)}${chosen.valid?'':`<p role="status">${QT('sourceUnavailable')}</p>`}<button class="primary" data-action="net-locate" data-id="${esc(chosen.annotation.id)}"${chosen.valid?'':' disabled'}>${QT('openSource')} ↗</button></div>` : `<p>${QT('evidenceChoose')}</p>`;
  return `<h3>${QT('evidenceTitle')}</h3><p class="network-path">${esc(path)}</p>${detail}<h4>${QT('evidenceList')} · ${rows.length}</h4><p class="network-source-count">${QT('rangesLabel')} · ${networkSourceCount(rows)}</p><div class="network-evidence-list" role="group" aria-label="${QT('evidenceList')}">${rows.map(a=>{
    const r=evidenceRecord(a.id);
    return `<button data-action="net-evidence" data-id="${esc(a.id)}" aria-pressed="${a.id===NET.evidenceId}"><strong>${esc(r.document?.name||a.document_id)} · [${a.start}, ${a.end})</strong><span>${esc(networkCodePath(a.code_id))}</span><span>${esc(cut(a.quote,0,100))}${cp(a.quote).length>100?'…':''}</span></button>`;
  }).join('')||`<p>${QT('noEvidence')}</p>`}</div>`;
}
function drawNetworkEvidence() {
  const panel = document.getElementById('network-evidence');
  if (!panel) return;
  drawNetworkControls();
  panel.innerHTML = networkEvidenceHtml();
  const picker = document.getElementById('network-select'), node = NET.index.get(NET.selected);
  if (picker) picker.value = node?.kind==='passage'?'code:'+node.code_id:(NET.selected||'');
  if (NET.restoreFocus) {
    NET.restoreFocus=false;
    const target=[...panel.querySelectorAll('[data-action="net-evidence"]')].find(b=>b.dataset.id===NET.evidenceId)||picker;
    target?.focus();
  }
}
function openNetworkSource(id) {
  const record = evidenceRecord(id);
  readingOverviewNav=null;readingOverviewFocus=null;readingOverview.open=false;
  if (!record?.valid) { toast(QT('sourceUnavailable'),true); return; }
  state.networkReturn = {projectId:state.project.id,docId:state.docId,search:state.search,codeFilter:state.codeFilter};
  state.docId=record.annotation.document_id; state.search=''; state.codeFilter=null;
  state.sourceFocus=id; state.selection=null; state.view='coding'; render();
}
function returnToNetwork() {
  const previous = state.networkReturn;
  if (!previous || previous.projectId!==state.project.id) return;
  state.docId=previous.docId; state.search=previous.search; state.codeFilter=previous.codeFilter;
  state.sourceFocus=null; state.networkReturn=null; state.view='insights'; state.insightsTab='map';
  NET.restoreFocus=true; render();
}
function networkSourceTrailHtml() {
  if (!state.networkReturn || state.networkReturn.projectId!==state.project.id) return '';
  const record=evidenceRecord(state.sourceFocus);
  return `<div class="network-source-trail"><button data-action="net-return">← ${QT('backToMap')}</button>${record?`<span>${esc(networkCodePath(record.annotation.code_id))} · [${record.annotation.start}, ${record.annotation.end})</span>`:''}<button class="link" data-action="net-dismiss">${QT('clearLocation')}</button></div>`;
}
function focusNetworkSource() {
  if (state.view!=='coding' || !state.sourceFocus) return;
  const target=document.querySelector('.source-target');
  if (target) { target.scrollIntoView({block:'center',behavior:'auto'}); target.focus({preventScroll:true}); }
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
    const [x, y] = scatter(NET.index.get('theme:' + code.theme_id), 120);
    code.x = x; code.y = y;
  });
  NET.nodes.filter((n) => n.kind === 'passage').forEach((p) => {
    const [x, y] = scatter(NET.index.get('code:' + p.code_id), 70);
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

function networkReducedMotion() {
  return document.documentElement?.dataset?.reducedMotion==='true' || !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
function wakeNetwork() {
  NET.alpha = 1;
  if (networkReducedMotion()) {
    if (NET.frame) cancelAnimationFrame(NET.frame);
    NET.frame=0;
    // Compute the same force layout without presenting moving frames.
    for (let i=0;i<220&&NET.alpha>=0.02;i++) stepNetwork();
    NET.alpha=0; drawNetwork(); return;
  }
  if (!NET.frame) NET.frame = requestAnimationFrame(tickNetwork);
}
function tickNetwork() {
  NET.frame = 0;
  if (!NET.svg || networkReducedMotion() || NET.alpha < 0.02) { NET.alpha=0; drawNetwork(); return; }
  stepNetwork(); drawNetwork();
  NET.frame = requestAnimationFrame(tickNetwork);
}
const networkMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
networkMotion?.addEventListener('change',()=>{
  if (!networkMotion.matches) return;
  if (NET.frame) cancelAnimationFrame(NET.frame);
  NET.frame=0; NET.alpha=0; drawNetwork();
});

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
      + '" opacity="' + (lit ? (node.kind === 'passage' ? 0.75 : 0.95) : 0.08) + '"><title>' + esc(node.hint||node.label) + '</title></circle>');
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
    + '<span><i class="net-dot net-dot--passage"></i>' + QT('codingsLabel') + ' ' + NET.levels.passages + '</span>'
    + '<span><i class="net-line"></i>' + QT('netOverlap', 'codes overlapping in one interview') + '</span>'
    + '<span>' + QT('rangesLabel') + ' ' + networkSourceCount(state.project.annotations.filter(a=>NET.index.has('code:'+a.code_id))) + '</span>';
}

function stepNetworkSelection(direction) {
  const choices=NET.nodes.filter(n=>n.kind!=='passage');
  if (!choices.length) return;
  const selected=NET.index.get(NET.selected);
  const current=selected?.kind==='passage'?'code:'+selected.code_id:NET.selected;
  const index=choices.findIndex(n=>n.id===current);
  const next=index<0?(direction>0?0:choices.length-1):(index+direction+choices.length)%choices.length;
  if (choices[next].id!==NET.selected) toggleNetworkNode(choices[next].id);
}
function drawNetworkControls() {
  const node=NET.index.get(NET.selected),codeId=node?.code_id;
  const summary=document.getElementById('network-selection');
  if (!summary) return;
  const rows=networkEvidenceRows();
  summary.textContent=node?networkCodePath(codeId||node.theme_id)+' · '+rows.length+' '+QT('codingsLabel')+' · '+networkSourceCount(rows)+' '+QT('rangesLabel'):QT('noNetworkSelection');
  const toggle=document.getElementById('network-passages');
  if (toggle) { toggle.disabled=!codeId; toggle.textContent=QT(NET.expanded.has('code:'+codeId)?'hidePassages':'showPassages');toggle.setAttribute('aria-expanded',String(NET.expanded.has('code:'+codeId))); }
  const clear=document.getElementById('network-clear');if(clear)clear.disabled=!node;
  for(const id of ['network-prev','network-next']){const button=document.getElementById(id);if(button)button.disabled=!NET.nodes.some(n=>n.kind!=='passage');}
}
function toggleNetworkPassages() {
  const node=NET.index.get(NET.selected);
  if (!node?.code_id) return;
  const id='code:'+node.code_id,hide=NET.expanded.has(id);
  const children=NET.links.filter(l=>l.kind==='coding'&&l.source===id);
  if (hide) {
    children.forEach(l=>NET.visible.delete(l.target));NET.expanded.delete(id);
    if(node.kind==='passage')NET.selected=id;
  } else {children.slice(0,NET.cap).forEach(l=>NET.visible.add(l.target));NET.expanded.add(id);}
  drawNetwork();drawNetworkLegend();drawNetworkEvidence();wakeNetwork();
}
function handleNetworkKey(event) {
  if (event.key!=='Escape'||!event.target.closest?.('.network-controls, .network-picker, .network-evidence, .network-stage')) return;
  event.preventDefault();clearNetworkSelection();document.getElementById('network-next')?.focus();
}
document.addEventListener('keydown',handleNetworkKey);

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
  NET.evidenceId = NET.selected && node.kind==='passage' ? networkPassageEvidence(node)?.id||null : null;
  drawNetwork();
  drawNetworkLegend();
  drawNetworkEvidence();
  wakeNetwork();
}

function clearNetworkSelection() {
  NET.selected = null; NET.evidenceId = null;
  NET.expanded.clear();
  NET.visible = new Set(NET.nodes.filter((n) => n.kind !== 'passage').map((n) => n.id));
  drawNetwork();
  drawNetworkLegend();
  drawNetworkEvidence();
  wakeNetwork();
}

document.addEventListener('click', (e) => {
  const circle = e.target.closest && e.target.closest('.net-node');
  if (circle) { toggleNetworkNode(circle.dataset.id); return; }
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

// A native select commits only an explicit change, never scroll or focus.
document.addEventListener('change',e=>{if(e.target.id==='reading-mark-status')saveReadingMark(e.target.value);});

function openResearchReport(method){return window.QTReport.open({project:state.project,method,figureOptions:state.plotOptions,lang:QT_LANG,readonly:state.config.public_demo,request:api,endpoint:projectUrl(),modal,onSaved:refresh,onLocate:locateReportEvidence,fetchFile:url=>fetch(url,{headers:{'X-QualiCraft-Token':state.token}})});}
