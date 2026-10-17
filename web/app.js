/* English unless the researcher asks otherwise. Following the browser locale
   silently put the whole interface in Chinese for anyone whose system is set
   to it, which is wrong for a tool shown to a supervisor or shared as a
   screenshot — the reader did not choose that. */
const QT_LANG=(()=>{const u=new URLSearchParams(location.search).get('lang');if(u){try{sessionStorage.setItem('qt_lang',u);}catch(e){}return u;}try{const s=sessionStorage.getItem('qt_lang');if(s)return s;}catch(e){}return 'en';})();
const _T={"en":{"loading":"Opening your local research workspace…","project":"PROJECT","switchProject":"Switch project","newProject":"+ New / import project","navCoding":"Coding workspace","navInsights":"Insights","navPlotting":"Figures","navAudit":"Audit trail","documents":"DOCUMENTS","codebook":"CODEBOOK","tools":"TOOLS","capabilityBlocks":"Capability blocks","localWorkspace":"Local workspace","noFileSelected":"No file selected","publicDemo":"Public demo","publicDemoNote":"Read-only sample project. Changes and uploads are disabled here; run QualiCraft locally to code your own material.","publicDemoReadOnly":"This public demonstration is read-only. Start a local copy to create or change projects.","publicDemoLocked":"Read-only demo. Run QualiCraft locally to make changes.","filterSidebar":"Filter documents and codes","noDocsFilter":"No documents match.","codeHits":"Codes matching","cloudNote":"Cloud only when requested","savedLocally":"Saved locally","model":"Model","export":"Export","switchLanguage":"Switch language","docCount":"documents","codeCount":"codes","codingCount":"codings","reviewCount":"to review","importInterview":"Import interview","mobileSwitch":"Switch / create project","footerBrand":"QUALICRAFT 0.1 · LOCAL WORKSPACE","footerTagline":"Exact source ranges · Researcher-reviewed coding","noDocEyebrow":"A SPACE FOR YOUR QUESTIONS","noDocTitle":"Start with a conversation","noDocBody":"Import TXT, DOCX, or paste a transcript.<br>Build a codebook, code by hand, or connect a model for suggestions.","noDocCreateCode":"Create code","searchDoc":"Search in document","documentLabel":"DOCUMENT","selectHint":"Select text to code a passage","newCode":"+ New code","analyzeAi":"Analyse with AI","readingNotes":"READING NOTES","readingPlaceholder":"First impressions, questions to follow up, anything that stands out.","aiReview":"AI REVIEW","suggestions":"Suggestions","reviewSubtitle":"Verify each interpretation against the source. A suggestion becomes a coding only after you accept it.","pending":"Pending review","reviewAccepted":"Accepted","reviewRejected":"Rejected","reviewFootnote":"Source ranges are verified automatically.<br>Interpretation remains your decision.","noCodes":"No codes yet. Add one to start coding.","noCodesFilter":"No codes to show.","noPassages":"No passages match your filters.","clearFilters":"Clear filters","human":"HUMAN","reference":"REFERENCE","aiReviewed":"AI · REVIEWED","demoSuggest":"DEMO SUGGESTION","aiSuggest":"AI SUGGESTION","locateQuote":"Locate this quotation in the source","rationale":"RATIONALE","acceptCoding":"Accept coding","reject":"Reject","acceptedState":"Accepted by researcher","rejectedState":"Rejected · decision recorded","noSuggestions":"No suggestions in this view","runAiOrChoose":"Run AI coding or choose another review status.","codeFreq":"Code frequency","network":"Relationship map","netLoading":"Building the map…","networkDesc":"Themes are the largest nodes, codes next, coded passages smallest. A dashed edge means two codes were applied to overlapping ranges in the same interview. That is descriptive — it is not correlation, and it is not a claim about a relationship. Click a theme to isolate its family, click a code to open its passages.","netOverlap":"codes overlapping in one interview","netClear":"Clear selection","freqDesc":"Each confirmed quotation–code link counts once. Frequency is not importance or a count of participants. Pending suggestions are excluded. Charts of these counts are drawn in the Figures view, each captioned with the unit it counts.","docCodeMatrix":"Document × code","matrixDesc":"Export the complete matrix as CSV for further analysis and plotting.","applyCodesHint":"Apply codes to see your research take shape.","figures":"Figures","plotDesc":"The figure is drawn by a script on the server, not in the browser, so the preview you see is exactly what the exported script produces.","plotNotInstalled":"The plotting workbench is not installed","plotInstallHint":"Figures are drawn by a Python script rather than in the browser, so the same script can be exported and re-run by a co-author. Install it and reopen this view:","plotNotEnough":"Not enough codings yet","plotNeedTwo":"A figure needs at least two coded passages before there is anything to plot.","plotExportBtn":"Download figure + script","plotExportNote":"A folder with the counts as CSV, the script, and the figure as SVG, PDF and 300 dpi PNG.","auditTitle":"Provenance and activity","auditActions":"actions","codebookShow":"show codes","codebookHide":"hide codes","enableAllBlocks":"Enable figure workflow","enableAllBlocksHint":"Adds theme grouping, Insights, Figures and Audit to this project. Other blocks keep their current settings.","blocksEnabled":"Figure workflow enabled for this project.","plotNoPairs":"No overlapping code ranges","plotNoPairsHint":"This figure counts codes that were applied to overlapping character ranges in the same interview. Two codes on separate passages are never a pair, so the figure stays empty however many codings the project has. Apply two codes to the same stretch of text, or choose a different figure type.","plotCouldNotDraw":"Could not draw the figure","charsLabel":" characters","spansParagraphs":" (spans paragraphs)","subLevel":"sub-level","codeSearchPh":"Type a keyword, press Enter to code","closeEsc":"Close (Esc)","moreOptions":"More options…","analyzeSel":"Analyse with AI","createCodeTpl":"＋ Create “%s” and code it","noCodesYet":"No codes yet — type a keyword to create one","toastCoded":"Coded.","toastCodeCreated":"Created “%s” and coded it.","toastNeedKeyword":"Type a keyword first, or pick a code from the list.","snapshots":"snapshots","backupFailed":"Backup failed","snapshotsTitle":"Snapshots","snapshotsIntro":"A restorable copy is written after every change. Restoring one creates a new project and leaves this one untouched.","restoreCopy":"Restore as a copy","noSnapshots":"No snapshots yet.","backupHint":"A restorable copy is written after every change. Restore it from the Projects dialog.","auditDesc1":"Personal research project. When sharing your findings, document the data source, methods, and role of AI assistance.","auditDesc2":"Activity is saved locally and included in project exports. This is an editable research trail, not a tamper-proof log.","figKind":"Figure type","kindFrequency":"Code frequency","kindCoverage":"Code × interview","kindCooccurrence":"Co-occurrence heatmap","kindHierarchy":"Theme hierarchy","kindAccumulation":"Code accumulation","withinOverlap":"Overlapping text","withinPassage":"The same passage","topN":"Top N codes","groupBy":"Group by","countWithin":"Count within","palette":"Palette","optional":"Optional","clustering":"Clustering","linkage":"Linkage","showCounts":"Show counts","baseFontSize":"Base font size","titleOpt":"Title","on":"On","off":"Off","yes":"Yes","no":"No","pt":"pt","themes":"Themes","codes":"Codes","passages":"Passages","importDlg":"Import interview","importDesc":"Import UTF-8 TXT or DOCX, or paste a transcript. Original line breaks define segments. Use Doctor:/Patient:, Interviewer:/Participant:, or IQ.../IP1: speaker labels. Chinese labels are also supported.","chooseFile":"Choose a file","fileHint":"DOCX imports paragraph and table text; layout, comments, and headers are not retained.","docName":"Document name","docNamePlaceholder":"e.g. P02 · Care experience","pasteTranscript":"Or paste a transcript","pastePlaceholder":"Doctor: How did the conversation feel?\\nPatient: ...","importBtn":"Import locally","importOther":"Import a coding table","importOtherLink":"Already have a coding table from another tool?","importOtherDesc":"Already coded elsewhere? Drop the export here and QualiCraft will read it into a new project — transcripts, codebook and codings, with the source licence recorded.","importOtherFormats":"OpenQDA or NVivo CSV · QualCoder .zip · ATLAS.ti or FAIRqual .xlsx","importOtherName":"Project name (optional)","importOtherNamePh":"Defaults to the file name","importOtherBtn":"Import coding table","importNoFile":"Choose a file first.","importWorking":"Reading the file…","importDone":"Imported","cancel":"Cancel","toolsDlg":"Capability blocks","toolsDesc":"The core is always there: <strong>documents, codes and codings</strong>. Everything else is a block — click one to add it to this project and the interface grows to match. Click again to take it away. Which blocks a study used is stored with the project, so it becomes part of the record.","saveBlocks":"Save blocks","createCode":"Create code","codeName":"Code name","codeNamePlaceholder":"e.g. Information barriers","codeDef":"Definition and inclusion criteria","codeDefPlaceholder":"Describe when to use this code and when to exclude it.","groupUnder":"Group under (optional)","topLevel":"— top level —","groupHint":"Choosing a parent makes this a sub-code. Grouping codes under a theme is what turns a flat tag list into a codebook.","color":"Color","saveCode":"Save code","editCode":"Edit code","status":"Status","emergent":"Emergent","provisional":"Provisional","final":"Final","codeMemo":"Code / theme memo","codeMemoPlaceholder":"How is this code or theme developing?","inclusion":"Inclusion criteria","inclusionPlaceholder":"Use this code when…","exclusion":"Exclusion criteria","exclusionPlaceholder":"Do not use it when…","anchorExamples":"Anchor examples (one per line)","anchorPlaceholder":"Typical quotations that illustrate this code.","saveChanges":"Save changes","delete":"Delete","mergeInto":"Merge into…","deleteCode":"Delete code","mergeCode":"Merge code","codePassage":"Code this passage","selectCode":"Select a code","researchMemo":"Research memo","removeCoding":"Remove coding","saveMemo":"Save memo","memoPlaceholder":"Record your interpretation or a question for comparison.","applyCode":"Apply code","settingsTitle":"Cloud model settings","settingsDesc":"The launcher can read a local API_key.txt. Keys entered here stay in server memory only, outside browser storage, projects, and exports.","apiBase":"API Base URL","apiBaseHint":"Alibaba Cloud Beijing: https://dashscope.aliyuncs.com/compatible-mode/v1. A workspace-specific URL in the same region or another compatible endpoint also works.","modelName":"Model name","modelHint":"Default: qwen3.8-flash. When switching providers, update the endpoint, model, and key together.","apiKey":"API Key","apiKeyConfigured":"Configured; leave blank to keep the key for this endpoint","apiKeyPlaceholder":"Enter your key here, not in chat","settingsNotice":"Manual coding is free and works offline. Cloud analysis runs only after confirmation and may incur provider charges. De-identify real transcripts and confirm that sharing them with this provider is permitted.","saveSettings":"Save settings","clearKey":"Clear key","analyzeTitle":"AI-assisted coding","analyzeDesc":"Preview the exact request before running analysis. Results arrive as suggestions for your review.","codingApproach":"Coding approach","deductive":"Deductive · existing codes only","inductive":"Inductive · allow new codes","analysisScope":"Analysis scope","scopePatient":"Labeled patient / participant turns","scopeAll":"All non-empty text segments","includeContext":"Include the preceding doctor or interviewer question as context when speaker labels are recognized.","analyzeNotice":"Up to 200 requests per run. Long segments are split at 6,000 characters. Speaker identification relies on explicit labels. Check the preview before sending.","previewRequests":"Preview requests","reviewRequest":"Review cloud request","modelPrefix":"Model: ","requestsCount":" requests · ","targetChars":" target characters","previewNotice":"Requests include the listed text, selected context, complete codebook definitions, and system instructions. Canceling stops subsequent requests; in-flight requests may still incur charges.","viewFullRequest":"View full request bodies (","noCredentials":" segments, no credentials)","reviewConfirm":"I have reviewed the content. These texts are de-identified and may be shared with this provider.","back":"Back","sendAnalyze":"Send and analyze","projectsTitle":"Research projects","existingProjects":"Existing projects","openProject":"Open project","newProjectName":"New project name","newProjectPlaceholder":"e.g. Experiences of outpatient care","createProject":"Create project","groundedProject":"Tian 2021 · software architecture interviews","groundedDesc":"Import 8 semi-structured practitioner interviews. IP1–IP2 pair Chinese responses with English translations; IP3–IP8 are in English.","demoProject":"Fictional care interview","demoDesc":"Explore a fictional transcript, sample coding, and fixed review suggestions.","benchmarkProject":"TU Delft · blind workspace","benchmarkDesc":"Import 7 transcripts and 54 codes, without reference annotations.","referenceProject":"TU Delft · researcher reference","referenceDesc":"Explore 377 researcher annotations for comparison. These are not model predictions.","restoreProject":"Restore project JSON","restoreDesc":"Restore a backup as a new project while keeping the original.","guideNote":"Guide collections are imported from the local Guide directory and retain source provenance in the project audit trail.","exportTitle":"Export your research","exportDesc":"Files are saved to your browser download folder. Full project exports include source transcripts; handle them as research data.","exportJson":"Full project · JSON","exportJsonDesc":"Transcripts, codebook, codings, suggestions, and activity. Restore later to continue.","exportCsv":"Codings · CSV","exportCsvDesc":"Document, code, source quote, character offsets, memo, and provenance.","exportMatrix":"Document × code · CSV","exportMatrixDesc":"Confirmed codings only, ready for Excel, R, or Python.","exportMethods":"Methods record · Markdown","exportMethodsDesc":"How the analysis was actually carried out, assembled from your audit trail. Draft the methods section from it.","projectCreated":"Project created and saved locally.","blocksUpdated":"Capability blocks updated.","keyCleared":"Key cleared from memory.","settingsSaved":"Settings saved. No text has been sent.","confirmFirst":"Confirm the request content first.","analysisStarted":"Analysis started. Results will appear as suggestions.","cancelRequested":"Cancellation requested. The current request may still finish.","interviewImported":"Interview imported.","codeSaved":"Code saved.","codeUpdated":"Code updated.","passageCoded":"Passage coded.","toastAccepted":"Accepted and added to your codings.","toastRejected":"Rejected; review decision saved.","memoSaved":"Memo saved.","codingRemoved":"Coding removed; the previous record is retained in the audit trail.","figureExported":"Figure, counts and script exported.","exported":"Exported to your browser download folder.","confirmPreview":"Confirm the preview before sending data","jobRunning":"Analyzing","jobStopping":"Stopping","jobComplete":"Analysis complete","jobCancelled":"Analysis canceled","jobFailed":"Analysis interrupted","stopRemaining":"Stop remaining requests","workspaceError":"Could not open workspace: ","workspaceErrorHint":"Check that the local server is running, then refresh.","add":"Add","added":"Added","blocksCount":" services","direct":" direct · ","includingSub":" including sub-codes","subCode":" sub-code(s)","expand":"Expand","collapse":"Collapse","close":"Close","live":"live","inProgress":"in progress","notCovered":"Not covered yet","codingMargin":"CODING MARGIN","charactersLabel":" characters","segmentsLabel":" segments","codingsLabel":" codings"},"zh":{"loading":"正在打开本地研究工作台…","project":"项目","switchProject":"切换项目","newProject":"+ 新建 / 导入项目","navCoding":"编码工作区","navInsights":"洞察","navPlotting":"图表","navAudit":"审计记录","documents":"文档","codebook":"编码本","tools":"工具","capabilityBlocks":"功能模块","localWorkspace":"本地工作区","noFileSelected":"未选择文件","publicDemo":"公开演示","publicDemoNote":"只读示例项目。此处已关闭修改与上传；请在本机运行 QualiCraft 来编码你自己的材料。","publicDemoReadOnly":"这是只读公开演示。请启动本地副本来创建或修改项目。","publicDemoLocked":"只读演示。请在本机运行 QualiCraft 进行修改。","filterSidebar":"筛选文档与编码","noDocsFilter":"没有匹配的文档。","codeHits":"匹配的编码","cloudNote":"仅在请求时连接云端","savedLocally":"已本地保存","model":"模型","export":"导出","switchLanguage":"切换语言","docCount":"份文档","codeCount":"个编码","codingCount":"条标注","reviewCount":"待审核","importInterview":"导入访谈","mobileSwitch":"切换 / 创建项目","footerBrand":"QUALICRAFT 0.1 · 本地工作区","footerTagline":"精确源码范围 · 研究者审核编码","noDocEyebrow":"为您的研究问题留出空间","noDocTitle":"从一段对话开始","noDocBody":"导入 TXT、DOCX 或粘贴访谈稿。<br>建立编码本，手动编码，或连接模型获取建议。","noDocCreateCode":"创建编码","searchDoc":"在文档中搜索","documentLabel":"文档","selectHint":"选中文字即可为段落编码","newCode":"+ 新建编码","analyzeAi":"AI 分析","readingNotes":"阅读笔记","readingPlaceholder":"第一印象、待跟进的问题、任何引起注意的内容。","aiReview":"AI 审核","suggestions":"建议","reviewSubtitle":"逐一核对每个解释与原文的匹配度。建议只有经您确认后才会成为正式编码。","pending":"待审核","reviewAccepted":"已采纳","reviewRejected":"已拒绝","reviewFootnote":"源码范围已自动验证。<br>解释由您决定。","noCodes":"尚无编码。添加一个即可开始编码。","noCodesFilter":"没有可显示的编码。","noPassages":"没有匹配的段落。","clearFilters":"清除筛选","human":"人工","reference":"参考","aiReviewed":"AI · 已审核","demoSuggest":"演示建议","aiSuggest":"AI 建议","locateQuote":"在原文中定位此引用","rationale":"理由","acceptCoding":"采纳编码","reject":"拒绝","acceptedState":"已由研究者采纳","rejectedState":"已拒绝 · 决定已记录","noSuggestions":"此视图下没有建议","runAiOrChoose":"运行 AI 编码或选择其他审核状态。","codeFreq":"编码频率","network":"关系网图","netLoading":"正在生成关系图…","networkDesc":"主题是最大的节点，编码次之，被编码的文本片段最小。虚线表示两个编码被用在同一份访谈里区间重叠的地方。这是描述性的——不代表相关，也不构成关系判断。点击主题可只看它这一支，点击编码可展开它的文本片段。","netOverlap":"在同一份访谈中重叠的编码","netClear":"清除选择","freqDesc":"每条已确认的引用—编码链接计为一次。频率不代表重要性，也不代表受访者数量。待审核建议不计入。需要按编码计数出图，请到「图表」页；每张图都写明它数的是什么。","docCodeMatrix":"文档 × 编码","matrixDesc":"导出完整矩阵为 CSV，以便进一步分析和绘图。","applyCodesHint":"应用编码，让您的研究逐渐成形。","figures":"图表","plotDesc":"图表由服务器端脚本绘制，而非浏览器，因此您看到的预览与导出的脚本结果完全一致。","plotNotInstalled":"绘图工作台未安装","plotInstallHint":"图表由 Python 脚本绘制而非浏览器，因此同一脚本可被导出并由合作者重新运行。安装后重新打开此视图：","plotNotEnough":"编码数量不足","plotNeedTwo":"绘图需要至少两条已编码段落。","plotExportBtn":"下载图表 + 脚本","plotExportNote":"包含计数 CSV、脚本以及 SVG、PDF 和 300 dpi PNG 格式的图表。","auditTitle":"来源与活动","auditActions":"条操作","codebookShow":"展开","codebookHide":"收起","enableAllBlocks":"启用绘图工作流","enableAllBlocksHint":"为本项目启用主题归组、洞察、绘图和审计，其他能力块保持当前设置。","blocksEnabled":"已为本项目启用绘图工作流。","plotNoPairs":"没有区间重叠的编码","plotNoPairsHint":"此图统计的是「同一份访谈中被应用到相互重叠字符区间」的编码对。两个编码如果落在不同段落上，就不构成一对，所以无论编了多少码，这张图都会是空的。请将两个编码应用到同一段文字，或改选其他图型。","plotCouldNotDraw":"无法绘制该图","charsLabel":" 字符","spansParagraphs":"（跨段）","subLevel":"子级","codeSearchPh":"输入关键字，回车即打标","closeEsc":"关闭 (Esc)","moreOptions":"更多选项…","analyzeSel":"AI 分析","createCodeTpl":"＋ 新建编码「%s」并打标","noCodesYet":"还没有编码，输入关键字即可新建","toastCoded":"已打标。","toastCodeCreated":"已新建编码「%s」并打标。","toastNeedKeyword":"先输入关键字，或从列表里选一个编码。","snapshots":"份快照","backupFailed":"备份失败","snapshotsTitle":"快照","snapshotsIntro":"每次改动后都会写一份可恢复的副本。恢复会新建一个项目，当前项目不受影响。","restoreCopy":"恢复为副本","noSnapshots":"还没有快照。","backupHint":"每次改动后都会写一份可恢复的副本。在「项目」对话框里恢复。","auditDesc1":"个人研究项目。分享研究结果时，请记录数据来源、方法和 AI 辅助的角色。","auditDesc2":"活动记录保存在本地，并包含在项目导出中。这是可编辑的研究记录，而非不可篡改的日志。","figKind":"图表类型","kindFrequency":"编码频率","kindCoverage":"编码 × 访谈","kindCooccurrence":"共现热力图","kindHierarchy":"主题层级","kindAccumulation":"编码累积","withinOverlap":"区间重叠","withinPassage":"同一段落","topN":"取前 N 个编码","groupBy":"分组方式","countWithin":"计数范围","palette":"配色","optional":"可选","clustering":"聚类","linkage":"连接方式","showCounts":"显示计数","baseFontSize":"基准字号","titleOpt":"标题","on":"开","off":"关","yes":"是","no":"否","pt":"磅","themes":"主题","codes":"编码","passages":"段落","importDlg":"导入访谈","importDesc":"导入 UTF-8 TXT 或 DOCX，或粘贴访谈稿。原始换行符定义段落。使用 Doctor:/Patient:、Interviewer:/Participant: 或 IQ.../IP1: 等说话人标签。中文标签也受支持。","chooseFile":"选择文件","fileHint":"DOCX 导入段落和表格文本；版式、批注和页眉不会被保留。","docName":"文档名称","docNamePlaceholder":"例如 P02 · 护理体验","pasteTranscript":"或粘贴访谈稿","pastePlaceholder":"医生：对话感觉如何？\\n患者：…","importBtn":"本地导入","importOther":"导入编码表","importOtherLink":"已经有别的工具导出的编码表？","importOtherDesc":"在别处编好码了？把导出文件放进来，QualiCraft 会把它读成一个新项目——转录、编码本和标注一起，并记下来源许可。","importOtherFormats":"OpenQDA 或 NVivo CSV · QualCoder .zip · ATLAS.ti 或 FAIRqual .xlsx","importOtherName":"项目名称（可选）","importOtherNamePh":"默认用文件名","importOtherBtn":"导入编码表","importNoFile":"请先选择一个文件。","importWorking":"正在读取文件…","importDone":"已导入","cancel":"取消","toolsDlg":"功能模块","toolsDesc":"核心功能始终可用：<strong>文档、编码和标注</strong>。其余均为模块——点击即可添加到本项目，界面会随之扩展。再次点击即可移除。研究使用了哪些模块会随项目一起保存，因此成为记录的一部分。","saveBlocks":"保存模块","createCode":"创建编码","codeName":"编码名称","codeNamePlaceholder":"例如 信息障碍","codeDef":"定义与纳入标准","codeDefPlaceholder":"描述何时使用此编码，何时排除。","groupUnder":"分组归属（可选）","topLevel":"— 顶级 —","groupHint":"选择父级会将此编码设为子编码。将编码归入主题下，才能把平面标签列表变成编码本。","color":"颜色","saveCode":"保存编码","editCode":"编辑编码","status":"状态","emergent":"涌现","provisional":"暂定","final":"最终","codeMemo":"编码 / 主题备忘录","codeMemoPlaceholder":"此编码或主题的发展情况如何？","inclusion":"纳入标准","inclusionPlaceholder":"在以下情况下使用此编码…","exclusion":"排除标准","exclusionPlaceholder":"在以下情况下不要使用…","anchorExamples":"锚点示例（每行一个）","anchorPlaceholder":"能说明此编码的典型引用。","saveChanges":"保存更改","delete":"删除","mergeInto":"合并到…","deleteCode":"删除编码","mergeCode":"合并编码","codePassage":"为段落编码","selectCode":"选择编码","researchMemo":"研究备忘录","removeCoding":"移除编码","saveMemo":"保存备忘录","memoPlaceholder":"记录您的解释或用于比较的问题。","applyCode":"应用编码","settingsTitle":"云端模型设置","settingsDesc":"启动器可以读取本地 API_key.txt。此处输入的密钥仅保存在服务器内存中，不会进入浏览器存储、项目或导出文件。","apiBase":"API 基础地址","apiBaseHint":"阿里云北京：https://dashscope.aliyuncs.com/compatible-mode/v1。同一区域或其他兼容端点的工作区专属地址也可以。","modelName":"模型名称","modelHint":"默认：qwen3.8-flash。切换提供商时，请同时更新端点、模型和密钥。","apiKey":"API 密钥","apiKeyConfigured":"已配置；留空可保留此端点的密钥","apiKeyPlaceholder":"在此输入密钥，不要在对话中发送","settingsNotice":"手动编码免费且可离线工作。云端分析仅在确认后运行，可能产生提供商费用。对真实访谈稿去标识化，并确认允许与提供商共享。","saveSettings":"保存设置","clearKey":"清除密钥","analyzeTitle":"AI 辅助编码","analyzeDesc":"运行分析前先预览具体请求。结果将以建议形式呈现供您审核。","codingApproach":"编码方式","deductive":"演绎 · 仅使用现有编码","inductive":"归纳 · 允许新建编码","analysisScope":"分析范围","scopePatient":"标记为患者 / 参与者的发言","scopeAll":"所有非空文本段落","includeContext":"识别到说话人标签时，将前面的医生或访谈者问题作为上下文包含在内。","analyzeNotice":"每次运行最多 200 条请求。长段落会在 6,000 字符处拆分。说话人识别依赖显式标签。发送前请先检查预览。","previewRequests":"预览请求","reviewRequest":"审核云端请求","modelPrefix":"模型：","requestsCount":" 条请求 · ","targetChars":" 目标字符","previewNotice":"请求包含所列文本、所选上下文、完整编码本定义和系统指令。取消会停止后续请求；进行中的请求可能仍会产生费用。","viewFullRequest":"查看完整请求内容（","noCredentials":" 个段落，不含凭证）","reviewConfirm":"我已审核内容。这些文本已去标识化，可以与此提供商共享。","back":"返回","sendAnalyze":"发送并分析","projectsTitle":"研究项目","existingProjects":"现有项目","openProject":"打开项目","newProjectName":"新项目名称","newProjectPlaceholder":"例如 门诊护理体验","createProject":"创建项目","groundedProject":"Tian 2021 · 软件架构访谈","groundedDesc":"导入 8 份半结构化从业者访谈。IP1–IP2 为中文回答配英文翻译；IP3–IP8 为英文。","demoProject":"虚构护理访谈","demoDesc":"探索一份虚构访谈稿、示例编码和固定的审核建议。","benchmarkProject":"代尔夫特理工 · 盲评工作区","benchmarkDesc":"导入 7 份访谈稿和 54 个编码，不含参考标注。","referenceProject":"代尔夫特理工 · 研究者参考","referenceDesc":"查看 377 条研究者标注以供比较。这些不是模型预测。","restoreProject":"恢复项目 JSON","restoreDesc":"将备份恢复为新项目，同时保留原始项目。","guideNote":"指南集从本地 Guide 目录导入，并在项目审计记录中保留来源出处。","exportTitle":"导出您的研究","exportDesc":"文件将保存到浏览器下载文件夹。完整项目导出包含源访谈稿；请按研究数据处理。","exportJson":"完整项目 · JSON","exportJsonDesc":"访谈稿、编码本、标注、建议和活动记录。后续可恢复继续工作。","exportCsv":"标注 · CSV","exportCsvDesc":"文档、编码、源引用、字符偏移、备忘录和来源。","exportMatrix":"文档 × 编码 · CSV","exportMatrixDesc":"仅包含已确认标注，可直接用于 Excel、R 或 Python。","exportMethods":"方法记录 · Markdown","exportMethodsDesc":"根据您的审计记录汇编实际执行的分析过程。可据此起草方法部分。","projectCreated":"项目已创建并保存在本地。","blocksUpdated":"功能模块已更新。","keyCleared":"密钥已从内存中清除。","settingsSaved":"设置已保存。尚未发送任何文本。","confirmFirst":"请先确认请求内容。","analysisStarted":"分析已开始。结果将以建议形式出现。","cancelRequested":"已请求取消。当前请求可能仍会完成。","interviewImported":"访谈已导入。","codeSaved":"编码已保存。","codeUpdated":"编码已更新。","passageCoded":"段落已编码。","toastAccepted":"已采纳并添加到您的标注中。","toastRejected":"已拒绝；审核决定已保存。","memoSaved":"备忘录已保存。","codingRemoved":"编码已移除；之前的记录保留在审计追踪中。","figureExported":"图表、计数和脚本已导出。","exported":"已导出到浏览器下载文件夹。","confirmPreview":"发送数据前请先确认预览","jobRunning":"分析中","jobStopping":"停止中","jobComplete":"分析完成","jobCancelled":"分析已取消","jobFailed":"分析中断","stopRemaining":"停止剩余请求","workspaceError":"无法打开工作区：","workspaceErrorHint":"请检查本地服务器是否正在运行，然后刷新页面。","add":"添加","added":"已添加","blocksCount":" 个服务","direct":" 直接 · ","includingSub":" 含子编码","subCode":" 个子编码","expand":"展开","collapse":"收起","close":"关闭","live":"在线","inProgress":"进行中","notCovered":"尚未覆盖","codingMargin":"编码边栏","charactersLabel":" 字符","segmentsLabel":" 段落","codingsLabel":" 编码"}};
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
  importedCoding:'IMPORTED', codebookTree:'Themes & codes', themeGroup:'Theme / group', parentCode:'Parent code', codeRole:'Code',
  ungroupedCode:'Ungrouped code', codebookHint:'Saved parent relationships · counts include descendants',
  codebookFind:'Find a code', savedCodings:'saved codings', overlappingRanges:'Overlapping ranges',
  codeFilterLabel:'Code filter', codePathLabel:'Saved code path', overlapCodings:'Codings overlapping this range',
  codingHighlight:'Saved coding', codingHighlightFocus:'Focused coding', codingKeyHint:'Hover or focus a coding to trace its path.',
  popupChoosePath:'Several codes match this name or path. Choose one with ↑ / ↓ and Enter, or select its full path.',
});
Object.assign(_T.zh, {
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
function QT(k,fb){const d=_T[QT_LANG];return(d&&d[k])||fb||k;}
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
  'code-delete', 'code-delete-ask', 'code-merge', 'code-merge-ask', 'save-document',
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
async function api(path, body) {
  if (body && state.config.public_demo) {
    throw new Error(QT('publicDemoReadOnly', 'This public demonstration is read-only. Start a local copy to create or change projects.'));
  }
  const url = path.startsWith('/api') ? QT_BASE + path : path;
  const response = await fetch(url, {method:body ? 'POST':'GET', headers:{'X-QualiCraft-Token':state.token,...(body?{'Content-Type':'application/json'}:{})}, ...(body?{body:JSON.stringify(body)}:{})});
  const data = await response.json(); if(!response.ok) { const error=new Error(data.error || 'Request failed'); error.status=response.status; throw error; } return data;
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
  const effective=ids.length?ids:(state.sourceFocus?[state.sourceFocus]:[]),chosen=new Set(effective),path=new Set();
  state.project?.annotations.filter(a=>chosen.has(a.id)).forEach(a=>{const c=codesFor(a);if(c)codeLineage(c).forEach(c=>path.add(c.id));});
  document.querySelectorAll('.passage mark[data-coding-ids]').forEach(mark=>mark.classList.toggle('coding-active',JSON.parse(mark.dataset.codingIds).some(id=>chosen.has(id))));
  document.querySelectorAll('.pill[data-code-id]').forEach(pill=>pill.classList.toggle('coding-active',chosen.has(pill.dataset.id)));
  document.querySelectorAll('.margin-tags').forEach(margin=>{const label=margin.querySelector('.coding-preview-path');if(!label)return;const own=[...margin.querySelectorAll('.pill[data-code-id]')].filter(el=>chosen.has(el.dataset.id)),names=[...new Set(own.map(el=>{const c=state.project.codes.find(c=>c.id===el.dataset.codeId);return c?codeIdentity(c):''}))];const first=margin.querySelector('.pill[data-code-id]'),fallback=first&&state.project.codes.find(c=>c.id===first.dataset.codeId);label.textContent=names.join(' · ')||(fallback?codeIdentity(fallback):'');});
  document.querySelectorAll('[data-coding-node],[data-code-node]').forEach(node=>node.classList.toggle('coding-path-active',path.has(node.dataset.codingNode||node.dataset.codeNode)));
  updateReadingPath();
}
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
  if(readingOverviewFocus){const target=document.querySelector('.overview-source-target');if(target){for(let pass=0;pass<2;pass++){const pane=$('#document-pane'),tools=$('.document-tools'),top=Math.max($('.reading-dock').getBoundingClientRect().bottom,pane.getBoundingClientRect().top,getComputedStyle(tools).position==='sticky'?tools.getBoundingClientRect().bottom:0),delta=target.getBoundingClientRect().top-top;if(getComputedStyle(pane).overflowY==='auto')pane.scrollTop+=delta;else window.scrollBy({top:delta,behavior:'instant'});}target.focus({preventScroll:true});}previewCoding(readingOverviewFocus.ids);}
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
document.addEventListener('focusin',event=>{if(event.target.id==='search')beginReadingSearch();});
document.addEventListener('pointerdown',readingSearchGesture);
document.addEventListener('wheel',readingSearchGesture,{passive:true});
document.addEventListener('touchmove',readingSearchGesture,{passive:true});
document.addEventListener('touchend',readingSearchGesture,{passive:true});
document.addEventListener('keydown',readingSearchGesture);
document.addEventListener('keyup',readingSearchGesture);
function captureReadingPosition() {
  if(!readingMounted||readingMounted.filtered||readingOverview.open||overviewPreviewNavigation()||document.activeElement?.id==='search'||readingSearchPosition({id:readingMounted.projectId},readingMounted.document))return;
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
  const paragraph=[...document.querySelectorAll('#reader .paragraph')].find(p=>Number(p.dataset.start)===start),pane=$('#document-pane'),dock=$('.reading-dock');
  if(!paragraph||!pane||!dock)return;
  // A phone's dock enters sticky positioning during the first movement.
  // Re-measure once so restoration aligns with its final viewport position.
  for(let pass=0;pass<2;pass++) {
    const tools=$('.document-tools'),toolsBottom=tools&&getComputedStyle(tools).position==='sticky'?tools.getBoundingClientRect().bottom:0;
    const top=Math.max(dock.getBoundingClientRect().bottom,pane.getBoundingClientRect().top,toolsBottom),delta=paragraph.getBoundingClientRect().top-top;
    if(getComputedStyle(pane).overflowY==='auto')pane.scrollTop+=delta;else window.scrollBy({top:delta,behavior:'instant'});
  }
  if(focus){paragraph.tabIndex=-1;paragraph.focus({preventScroll:true});}
}
function mountReading(restore=true) {
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
  if(event&&event.type==='scroll'&&event.target!==document&&event.target!==$('#document-pane'))return;
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
  const p=state.project;
  if(!p.codes.length)return `<div class="empty">${QT('noCodes','No codes yet. Add one to start coding.')}</div>`;
  const {own,total}=codeCounts(),byParent=new Map(),needle=state.sideFilter.trim().toLowerCase();
  p.codes.forEach(c=>{const key=c.parent_id||null;if(!byParent.has(key))byParent.set(key,[]);byParent.get(key).push(c);});
  byParent.forEach(list=>list.sort((a,b)=>(a.order??0)-(b.order??0)||a.name.localeCompare(b.name)));
  const row=(c,search=false)=>{
    const children=byParent.get(c.id)||[],open=!state.collapsed.has(c.id),path=codeIdentity(c),role=codeRole(c);
    return `<li data-code-node="${c.id}" data-parent-id="${esc(c.parent_id||'')}"><div class="code-row">
      ${children.length&&!search?`<button class="twisty" data-action="toggle-code" data-id="${c.id}" aria-expanded="${open}" aria-controls="cb-${context}-${c.id}" aria-label="${esc((open?QT('collapse','Collapse'):QT('expand','Expand'))+' '+c.name)}">${open?'▾':'▸'}</button>`:'<span class="twisty leaf" aria-hidden="true">·</span>'}
      <button class="side-item${state.codeFilter===c.id?' selected':''}" data-action="filter-code" data-id="${c.id}" aria-pressed="${state.codeFilter===c.id}" aria-label="${esc(role+': '+path+' · '+(total.get(c.id)||0)+' '+QT('savedCodings'))}" title="${esc(path+(c.definition?' — '+c.definition:''))}">
        <span class="code-row-label"><span class="code-role">${esc(role)}</span><span class="name">${esc(c.name)}${c.status!=='final'?`<span class="status-flag">${esc(c.status)}</span>`:''}</span>${search?`<small class="code-parent">${esc(path)}</small>`:path!==codePath(c)?`<small class="code-identity-id">${esc(c.id)}</small>`:''}</span>
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
  const host=context==='mobile'?mobile:$('#side-list');
  [...host?.querySelectorAll(`[data-action="${part}"]`)||[]].find(el=>el.dataset.id===id)?.focus({preventScroll:true});
  previewCoding(codingPreview);
}
function handleCodebookKey(event) {
  if(event.altKey||event.ctrlKey||event.metaKey)return;
  const button=event.target.closest('.codebook-tree [data-action="filter-code"],.codebook-tree [data-action="toggle-code"]');if(!button)return;
  const tree=button.closest('.codebook-tree'),id=button.dataset.id,code=state.project.codes.find(c=>c.id===id),context=tree.closest('#mobile-codebook-list')?'mobile':'side';
  const visible=[...tree.querySelectorAll('[data-action="filter-code"]')].filter(el=>el.getClientRects().length),index=visible.findIndex(el=>el.dataset.id===id),children=state.project.codes.filter(c=>c.parent_id===id);
  let next;
  if(event.key==='ArrowDown')next=visible[Math.min(index+1,visible.length-1)];else if(event.key==='ArrowUp')next=visible[Math.max(0,index-1)];else if(event.key==='Home')next=visible[0];else if(event.key==='End')next=visible.at(-1);
  else if(event.key==='ArrowRight'){
    if(children.length&&state.collapsed.has(id)){event.preventDefault();state.collapsed.delete(id);refreshCodebooks(id,'filter-code',context);return;}
    next=visible.find(el=>el.closest('[data-code-node]').dataset.parentId===id);
  }else if(event.key==='ArrowLeft'){
    if(children.length&&!state.collapsed.has(id)){event.preventDefault();state.collapsed.add(id);refreshCodebooks(id,'filter-code',context);return;}
    next=visible.find(el=>el.dataset.id===code.parent_id);
  }else return;
  event.preventDefault();next?.focus();next?.scrollIntoView({block:'nearest'});
}
function showMobileCodebook() {
  modal(QT('codebookTree'),`<label class="field">${QT('codebookFind')}<input id="mobile-code-filter" type="search" value="${esc(state.sideFilter)}" autocomplete="off"></label><div id="mobile-codebook-list">${codebookHtml('mobile')}</div>`);
  $('#dialog').dataset.codingCodebook='1';$('#mobile-code-filter').focus();
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
    <div class="side-title"><button class="side-toggle" data-action="toggle-codebook" aria-expanded="${open}"><span class="twisty">${open?'▾':'▸'}</span>${QT('codebookTree')} <span class="count">${total}</span>${total?`<span class="side-hint">${open?QT('codebookHide','hide codes'):QT('codebookShow','show codes')}</span>`:''}</button><button class="link" data-action="code"${demoLock()} aria-label="${QT('createCode','Create code')}">＋</button></div>
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
// UX-26: startup and guide preferences are browser-only navigation, never research data.
function workspaceMemoryKey() { return 'qt.workspace.v1:'+QT_BASE; }
function rememberWorkspaceProject(id) {
  try{localStorage.setItem(workspaceMemoryKey(),JSON.stringify({version:1,projectId:id}));}catch(_){}
}
function selectedStartupProject(projects,publicDemo=false) {
  try{const saved=JSON.parse(localStorage.getItem(workspaceMemoryKey()));if(saved?.version===1&&typeof saved.projectId==='string'&&projects.some(p=>p.id===saved.projectId))return saved.projectId;}catch(_){}
  return publicDemo?(projects[0]?.id||null):null;
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
  const last=selectedStartupProject(state.projects,false),recent=state.projects.find(p=>p.id===last),readonly=state.config.public_demo;
  return `<a class="workspace-skip" href="#workspace-content">Skip to workspace</a><div class="shell shell--welcome"><main class="welcome-sheet" id="workspace-content" tabindex="-1"><header class="welcome-header"><span class="welcome-brand">${qtMark()}</span><span>${QT('localWorkspace','Local workspace')}</span><button id="workspace-help" data-action="guide-open">${QT('help','Help')}</button></header><div class="welcome-orbit" id="welcome-orbit"><canvas aria-hidden="true"></canvas><div class="welcome-orbit-qt">${qtMark()}</div>${['Import','Coding','Analysis','Plotting','Export'].map(name=>`<span data-satellite="${name}" aria-hidden="true">${name}</span>`).join('')}<button type="button" aria-label="Pause or play the satellite background" aria-pressed="false">Pause motion</button></div><div class="welcome-content"><p class="welcome-eyebrow">${QT('startEyebrow','YOUR NEXT CONVERSATION')}</p><h1 tabindex="-1">${readonly?(state.projects.length?QT('startReadOnlyTitle','Choose a read-only example.'):QT('startReadOnlyEmpty','No example project is available')):QT('startTitle','Start with your material.')}</h1><p class="welcome-intro">${readonly?QT('startReadOnlyInfo','This workspace is read-only.'):QT('startIntro','Import a document, choose an example, or return to your work.')}</p><div id="guide-region">${quickGuideHtml()}</div>
    ${recent?`<section class="welcome-resume"><div><span>${QT('continueLast','Continue last project')}</span><strong>${esc(recent.name)}</strong></div><button class="primary" data-action="open-project" data-id="${esc(recent.id)}">${QT('continueWork','Continue')} →</button></section>`:''}
    ${readonly?'':`<div class="welcome-options"><section><span class="welcome-number">01</span><h2>${QT('startOwn','Your project')}</h2><p>${QT('startOwnText','Begin with an empty workspace. Add one document when you are ready.')}</p><button class="primary" data-action="start-project">${icon('upload')}${QT('startImport','Import a document')}</button></section>${state.config.bologna_example_available?`<section><span class="welcome-number">02</span><h2>${QT('startExample','Try Bologna')}</h2><p>${QT('startExampleText','Explore saved codes and sources in a separate, editable example copy.')}</p><button data-action="bologna-project">${QT('startExample','Try Bologna')} →</button></section>`:''}</div>`}
    ${state.projects.length?`<section class="welcome-existing"><label for="start-project-select">${QT('existingProjects','Existing projects')}</label><div><select id="start-project-select"><option value="">${QT('chooseProject','Choose a project')}</option>${state.projects.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</select><button data-action="start-open" disabled>${QT('openProject','Open project')}</button></div></section>`:''}
    ${readonly?'':`<div class="welcome-restore"><button class="link" data-action="restore-pick">${QT('restoreProject','Restore project JSON')} ↗</button><span>${QT('restoreSafe','Opens as a new project.')}</span></div><input id="restore-file" type="file" accept=".json" hidden>`}<p class="welcome-local">${QT('startLocal','Projects stay in this workspace. The remembered project and reading positions belong to this browser.')}</p></div></main></div>`;
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
async function loadProject(id) {
  captureReadingPosition();
  const project=await api(`/api/projects/${id}`);
  state.project=project;state.docId=preferredReadingDocument(project);rememberWorkspaceProject(project.id);
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
  const dlg=$('#dialog'); delete dlg.dataset.workflow;delete dlg.dataset.codingId;delete dlg.dataset.codingCodebook;delete dlg.dataset.codingEdit;delete dlg.dataset.startup; dlg.innerHTML=`<div class="modal-head"><h2>${esc(title)}</h2><button data-action="close" aria-label="${QT('close','Close')}">×</button></div><div class="modal-body">${body}<div id="modal-error" role="alert"></div></div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;
  if(!dlg.open) dlg.showModal();
}
function closeModal() { $('#dialog').close(); $('#dialog').innerHTML=''; }
function errorDisplay(error) { if($('#dialog').open && $('#modal-error')) { $('#modal-error').className='inline-error'; $('#modal-error').textContent=error.message; } else toast(error.message,true); }
function render() {
  captureReadingPosition();
  const p=state.project;if(!p){readingMounted=null;$('#app').innerHTML=startupHtml();window.mountWelcomeOrbit?.($('#welcome-orbit'));return;}
  window.mountWelcomeOrbit?.(null);
  const pending=p.suggestions.filter(s=>s.status==='pending').length;
  const titles={coding:QT('navCoding','Coding workspace'),insights:QT('navInsights','Insights'),audit:QT('navAudit','Audit trail'),plotting:QT('navPlotting','Figures')};
  $('#app').innerHTML=`<a class="workspace-skip" href="#workspace-content">Skip to workspace</a><div class="shell shell--${state.view}">
    <aside class="sidebar"><div class="brand">${qtMark()}<span class="version">ALPHA</span></div>
    <div class="section-label">${QT('project','PROJECT')}</div><select id="project-select" class="project-select" aria-label="${QT('switchProject','Switch project')}">${state.projects.map(x=>`<option value="${esc(x.id)}" ${x.id===p.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
    <button class="link new-project" data-action="projects">${QT('newProject','+ New / import project')}</button>
    <nav class="nav" aria-label="Main navigation">${[['coding','grid',QT('navCoding','Coding workspace')],['insights','chart',QT('navInsights','Insights')],['plotting','image',QT('figures','Figures')],['audit','history',QT('navAudit','Audit trail')]].filter(([view])=>view==='coding'||hasBlock(view)).map(([view,i,t])=>`<button class="${state.view===view?'active':''}" data-action="view" data-view="${view}" title="${t}" aria-label="${t}"${state.view===view?' aria-current="page"':''}>${icon(i)}<span class="nav-label">${t}</span></button>`).join('')}</nav>
    <div class="sidebar-scroll">
    <input id="side-filter" class="side-filter" type="search" autocomplete="off" spellcheck="false" aria-label="${QT('filterSidebar','Filter documents and codes')}" placeholder="${QT('filterSidebar','Filter documents and codes')}" value="${esc(state.sideFilter)}">
    <div id="side-list">${sideListHtml()}</div>
    <div class="side-title"><div class="section-label">${QT('tools','TOOLS')} <span class="count">${(p.blocks||[]).length}/${BLOCKS.length}</span></div></div><button class="side-item" data-action="tools" title="Add or remove capability blocks"><span class="tools-glyph">\u229e</span><span class="name">${QT('toolsDlg','Capability blocks')}</span><span class="count">${(p.blocks||[]).length}</span></button>
    </div><div class="local-note"><span class="status-dot"></span><div><strong>${QT('localWorkspace','Local workspace')}</strong><span>${QT('cloudNote','Cloud only when requested')}</span></div></div></aside>
    <main class="workspace" id="workspace-content" tabindex="-1"><header class="topbar"><div class="breadcrumb"><strong>${esc(p.name)}</strong><span>${titles[state.view]}</span></div><div class="top-actions">${saveStateHtml()}<button data-action="toggle-motion" aria-pressed="${motionPreference==='reduce'}" title="${QT('motionHint','Reduce movement, or follow system preferences')}">${motionLabel()}</button><button data-action="toggle-lang" title="${QT('switchLanguage','Switch language')}">${QT_LANG==='zh'?'EN':'ZH'}</button><button data-action="settings">${icon('setting')}${QT('model','Model')}</button><button data-action="export">${icon('down')}${QT('export','Export')}</button><button id="workspace-help" data-action="guide-open">${QT('help','Help')}</button></div></header>
    ${state.config.public_demo?`<div class="public-demo-banner" role="status"><strong>${QT('publicDemo','Public demo')}</strong><span>${QT('publicDemoNote','Read-only sample project. Changes and uploads are disabled here; run QualiCraft locally to code your own material.')}</span></div>`:''}
    ${!state.config.public_demo&&isBolognaExample(p)?`<details class="example-context"><summary><strong>${QT('bolognaLabel','Bologna example')}</strong><span>${QT('editableExample','Editable in this local workspace')}</span></summary><button class="link" data-action="start-project">${QT('startOwnAction','Start your own project')} →</button></details>`:''}
    <section class="project-strip"><div><h1>${esc(p.name)}</h1><div class="metrics"><span><b>${p.documents.length}</b> documents</span><span><b>${p.codes.length}</b> codes</span><span><b>${p.annotations.length}</b> codings</span><span class="pending-metric"><b>${pending}</b> ${QT('reviewCount','to review')}</span></div></div><button class="primary" data-action="import"${demoLock()}>${icon('upload')}${QT('importDlg','Import interview')}</button></section>
    <div id="job-status"></div><div class="mobile-only mobile-project-bar"><button class="link" data-action="projects">${state.config.public_demo?QT('switchProject','Switch project'):QT('mobileSwitch','Switch / create project')}</button><button id="workspace-help-mobile" class="link" data-action="guide-open">${QT('help','Help')}</button></div>
    <div id="guide-region">${quickGuideHtml()}</div>
    ${state.view==='coding'?codingView():state.view==='insights'?insightsView():state.view==='plotting'?plottingView():auditView()}
    <footer class="bottom-bar"><span>${QT('workspaceIdentity','QT 0.1 · LOCAL WORKSPACE')}</span><span>${QT('footerTagline','Exact source ranges · Researcher-reviewed coding')}</span></footer></main></div>`;
  renderJob();
  loadPlotPreview();
  loadNetwork();
  focusNetworkSource();
  mountReading();
  previewCoding(state.view==='coding'&&overviewPreviewNavigation()&&readingOverviewFocus?readingOverviewFocus.ids:[]);
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
    return `<mark${classes?` class="${classes}"`:''}${source||overview?' tabindex="-1"':''} data-coding-ids="${esc(JSON.stringify(active.map(x=>x.id)))}" data-coding-count="${active.length}" title="${esc(activeCodes.map(c=>c.name).join(' · '))}">${part}</mark>`;
  }).join('');
}

function codingView() {
  const d=doc();if(!d)return emptyProjectHtml();
  ensureReadingOverview();
  return `${networkSourceTrailHtml()}<section class="reading-dock" aria-label="${QT('readingNavigation','Reading navigation')}">
    <div class="reading-primary"><label class="reading-document-label" for="reading-document">${icon('doc')}<span class="sr-only">${QT('readingDocument','Current document')}</span></label><select id="reading-document" aria-label="${QT('readingDocument','Current document')}">${state.project.documents.map(item=>`<option value="${esc(item.id)}" ${item.id===d.id?'selected':''}>${esc(item.name)}</option>`).join('')}</select><output id="reading-position" aria-label="${QT('readingPosition','Reading position')}"></output><button data-action="reading-resume" title="${QT('readingResumeHint','Return to the saved paragraph in this browser. Position is not a read mark.')}">${QT('readingResume','Resume')}</button><button type="button" data-action="reading-overview" aria-expanded="${readingOverview.open}" aria-controls="reading-overview">${QT('ovOverview','Overview')}</button></div>
    <div class="reading-marks" id="reading-marks" role="group" aria-label="${QT('projectMarks','Project reading marks')}"><select id="reading-mark-status" aria-label="${QT('projectMark','Project mark')}">${['unmarked','read','revisit'].map(status=>`<option value="${status}">${markLabel(status)}</option>`).join('')}</select><button type="button" data-action="reading-mark-read">${QT('markRead','Mark read')}</button><button type="button" data-action="reading-mark-undo" disabled>${QT('markUndo','Undo')}</button><button type="button" data-action="reading-mark-retry" hidden>${QT('markRetry','Retry')}</button><button type="button" data-action="reading-mark-reset" hidden>${QT('markReset','Reset marks…')}</button><span id="reading-mark-save"></span></div>
    <div class="reading-context" tabindex="0" role="region" aria-label="${QT('readingPaths','Coding paths at this position')}"><span id="reading-path-label">${QT('readingHere','Codings here')}</span><span id="reading-code-path"></span></div><span id="reading-announcement" class="sr-only" role="status"></span>
  </section><div class="work-grid${hasBlock('ai')&&state.project.suggestions.length?'':' no-review'}"><section class="document-pane" id="document-pane" aria-label="Source transcript">
  <div class="document-tools"><input id="search" class="search" type="search" placeholder="${QT('searchDoc','Search in document')}" aria-label="Search transcript" value="${esc(state.search)}"><button class="mobile-only reading-tools-toggle" data-action="reading-tools" aria-expanded="false" aria-controls="reading-coding-tools">${QT('readingTools','Coding tools')}</button><button type="button" class="coding-codebook-entry" data-action="coding-codebook">${QT('codebookTree')}</button><div class="tool-group" id="reading-coding-tools"><button data-action="code"${demoLock()}>${QT('newCode','+ New code')}</button><button class="primary${hasBlock('ai')?'':' block-off'}" data-action="analyze"${demoLock()}>${icon('star')}${QT('analyzeAi','Analyse with AI')}</button></div></div>
  <section id="reading-overview" class="reading-overview" aria-labelledby="overview-title" ${readingOverview.open?'':'hidden'}>${readingOverviewHtml()}</section>
  ${state.importReceipt===d.id?`<div class="import-receipt" role="status">${icon('doc')}<strong>${QT('importedLocal')}</strong><span>✓</span></div>`:''}<details class="reading-details"><summary>${QT('readingDetails','Document details & notes')}<span>${segments(d.text).length} ${QT('readingParagraphs','paragraphs')} · ${state.project.annotations.filter(a=>a.document_id===d.id).length} ${QT('savedCodings')}</span></summary><div class="reader-header"><div><h2 class="reader-heading" tabindex="-1">${esc(d.name)}</h2><div class="reader-meta">${cp(d.text).length.toLocaleString()} characters · ${segments(d.text).length} segments · ${state.project.annotations.filter(a=>a.document_id===d.id).length} codings</div></div></div>
  <p class="reading-marks-help">${QT('markPolicy','Project marks are manual and shared with this file; they do not prove reading or understanding. Reading-only changes are saved to the project and enter its next snapshot. Export JSON to keep this state now. JSON format v5 requires this version of QT.')}</p><p class="reading-memory-note">${QT('readingMemoryNote','Position only · stored in this browser, outside project exports. Scrolling does not mark text as read.')}</p><div class="reading-note${hasBlock('memos')?'':' block-off'}"><label class="reading-note-label" for="doc-memo">${QT('readingNotes','READING NOTES')}</label><textarea id="doc-memo" rows="2" placeholder="${QT('readingPlaceholder','First impressions, questions to follow up, anything that stands out.')}">${esc(d.memo||'')}</textarea><span class="reading-note-state" id="doc-memo-state"></span></div></details>
  <div id="reader">${readerHtml()}</div></section><aside class="review-pane${hasBlock('ai')?'':' block-off'}" aria-label="AI suggestion review"><div class="review-header"><div class="panel-kicker">${QT('aiReview','AI REVIEW')}</div><div class="review-title"><h3>${QT('suggestions','Suggestions')}</h3><span class="count">${state.project.suggestions.filter(s=>s.document_id===d.id&&s.status==='pending').length}</span></div><p class="review-subtitle">${QT('reviewSubtitle','Verify each interpretation against the source. A suggestion becomes a coding only after you accept it.')}</p><select id="review-filter" class="review-filter" aria-label="Suggestion status">${[['pending',QT('pending','Pending review')],['accepted',QT('reviewAccepted','Accepted')],['rejected',QT('reviewRejected','Rejected')]].map(([v,t])=>`<option value="${v}" ${state.reviewFilter===v?'selected':''}>${t}</option>`).join('')}</select></div><div class="suggestion-list">${suggestionsHtml()}</div><div class="review-footnote">Source ranges are verified automatically.<br>Interpretation remains your decision.</div></aside></div>`;
}
function readerHtml() {
  const d=doc(), annotations=state.project.annotations.filter(a=>a.document_id===d.id);
  // Match the sidebar's rolled-up scope, including codings on the parent itself.
  const filterCodes=state.codeFilter?new Set([state.codeFilter,...codeDescendants(state.codeFilter)]):null;
  const paras=segments(d.text).filter(p=> (!state.search||p.text.toLocaleLowerCase().includes(state.search.toLocaleLowerCase())) && (!filterCodes||annotations.some(a=>filterCodes.has(a.code_id)&&a.start<p.end&&a.end>p.start)));
  const filter=state.codeFilter?`<p class="tiny-label reader-code-filter">${QT('codeFilterLabel')}: ${esc(codeIdentity(state.project.codes.find(c=>c.id===state.codeFilter)))} <button class="link" data-action="clear-filter">${QT('clearFilters','Clear filters')}</button></p>`:'';
  return `<div class="coding-key"><span>${QT('codingHighlight')}</span><span>${QT('codingHighlightFocus')}</span><small>${QT('codingKeyHint')}</small></div>`+filter+(paras.map(p=>{
    const matches=annotations.filter(a=>a.start<p.end&&a.end>p.start);
    return `<div class="paragraph" data-start="${p.start}" data-end="${p.end}" tabindex="-1" data-reading-mark="${paragraphMark(d,p.start)}"><span class="line-no">${String(p.index+1).padStart(2,'0')}<span class="reading-mark-badge" role="img" aria-label="${markLabel(paragraphMark(d,p.start))}" title="${markLabel(paragraphMark(d,p.start))}"${paragraphMark(d,p.start)==='unmarked'?' hidden':''}>${paragraphMark(d,p.start)==='read'?'✓':paragraphMark(d,p.start)==='revisit'?'↺':''}</span></span><div class="passage ${p.speaker==='doctor'?'doctor':''}" data-start="${p.start}">${highlight(p.text,p.start,annotations)}</div><div class="margin-tags"${matches.length?` role="region" tabindex="0" aria-label="${QT('codebookTree')} · ${matches.length} ${QT('savedCodings')}"`: ''}>${marginHtml(matches)}</div></div>`;
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
  return `<div class="view-body insights-body">${nav}${state.insightsTab==='frequency'?frequency:state.insightsTab==='matrix'?matrix:map}</div>`;
}
let plotBlobUrl = null;
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
    const source = await response.blob();
    plotPreviewSources.set(img, source);
    plotBlobUrl = URL.createObjectURL(source);
    img.addEventListener('load', () => {
      const button = document.querySelector('[data-action="plot-view"]');
      if (img.isConnected && img.naturalWidth && button) button.disabled = false;
    }, {once:true});
    img.src = plotBlobUrl;
    img.classList.remove('loading');
  } catch (error) {
    const stage = img.parentElement;
    if (stage) {
      // Co-occurrence is the one figure that can be empty while the project has
      // codings to spare. It counts pairs of codes whose character ranges
      // overlap inside the same interview, so codes placed on separate passages
      // never form a pair — the figure stays blank however much has been coded.
      // The backend says "no data at this setting; widen the filter", which is
      // accurate and tells the reader nothing about what would change it.
      const isCooccurrence = state.plotOptions && state.plotOptions.kind === 'cooccurrence';
      stage.innerHTML = isCooccurrence
        ? '<div class="plot-empty"><strong>' + QT('plotNoPairs', 'No overlapping code ranges') + '</strong>'
          + '<p>' + QT('plotNoPairsHint', 'This figure counts codes that were applied to overlapping character ranges in the same interview. Two codes on separate passages are never a pair, so the figure stays empty however many codings the project has. Apply two codes to the same stretch of text, or choose a different figure type.') + '</p></div>'
        : '<div class="plot-empty"><strong>' + QT('plotCouldNotDraw', 'Could not draw the figure') + '</strong><p>'
          + esc(error.message) + '</p></div>';
    }
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
    + '<div class="plot-grid">' + controls + '<div class="plot-preview-wrap">'
    + (ready ? `<div class="plot-preview-tools"><button type="button" data-action="plot-view" disabled>${QT('plotEnlarge')}</button></div>` : '')
    + '<div class="plot-stage">' + stage + '</div></div></div>'
    + '<div class="plot-actions">'
    + '<button class="primary" data-action="plot-export"' + (ready ? '' : ' disabled') + `>${QT('plotExportBtn','Download figure + script')}</button>`
    + `<span class="muted">${QT('plotExportNote','A folder with the counts as CSV, the script, and the figure as SVG, PDF and 300 dpi PNG.')}</span>`
    + '</div></section></div>';
}
const actionNames={reading_mark_set:QT('projectMark','Project mark'),reading_marks_reset:QT('markReset','Reading marks reset'),document_import:'Document imported',code_create:QT('createCode','Create code'),annotation_create:'Coding created',suggestion_review:'Suggestion reviewed',analysis_start:'Analysis started',analysis_segment:'Segment analyzed',analysis_finish:'Analysis finished',benchmark_import:'Benchmark imported',annotation_remove:'Coding removed',memo_update:'Memo updated',project_restore:'Project restored'};
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
  const paths=new Map();
  all.forEach(m=>paths.set(m.path,(paths.get(m.path)||0)+1));
  all.forEach(m=>{
    m.identity=paths.get(m.path)>1?`${m.path} · ${m.code.id}`:m.path;
    const full=needle&&(m.path.toLowerCase()===needle||m.identity.toLowerCase()===needle);
    const name=needle&&m.code.name.toLowerCase()===needle;
    m.exact=!!(full||name);
    m.rank=full?0:name?1:2;
  });
  if(!needle) return all.slice(0,8);
  // Rank before the display cap so a saved exact name cannot be hidden by parents.
  return all.filter(m=>m.exact||m.identity.toLowerCase().includes(needle)).sort((a,b)=>a.rank-b.rank).slice(0,8);
}
function showCodePopup() {
  removeCodePopupDom();
  const sel=state.selection; if(!sel) return;
  const host=document.createElement('div');
  host.id='code-popup';
  host.className='code-popup';
  host.innerHTML=`
    <div class="code-popup-row">
      <input id="code-search" type="text" autocomplete="off" spellcheck="false" placeholder="${esc(QT('codeSearchPh','Type a keyword, press Enter to code'))}">
      <button class="code-popup-x" data-action="close-popup" title="${esc(QT('closeEsc','Close (Esc)'))}">✕</button>
    </div>
    <div class="code-suggest" id="code-suggest"></div>
    <div class="code-popup-foot">
      <span class="code-popup-count">${sel.end-sel.start}${QT('charsLabel',' characters')}${state.selectionSpansParagraphs?QT('spansParagraphs',' (spans paragraphs)'):''}</span>
      <button data-action="annotate">${esc(QT('moreOptions','More options…'))}</button>
      <button data-action="analyze-selection">${esc(QT('analyzeSel','Analyse with AI'))}</button>
    </div>`;
  document.body.appendChild(host);
  renderCodeSuggest('');
  positionCodePopup();
  setTimeout(positionCodePopup,120);
  setTimeout(positionCodePopup,320);
  const input=$('#code-search');
  if(input) {
    input.focus();
    input.addEventListener('input',e=>{renderCodeSuggest(e.target.value);positionCodePopup();});
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
  const exact=matches.some(m=>m.exact);
  const ambiguous=matches.filter(m=>m.exact).length>1;
  state.popupMatches=matches;
  state.popupCursor=0;
  state.popupCursorMoved=false;
  const rows=matches.map((m,i)=>`<button class="suggest-row${i===0?' active':''}" data-action="popup-apply" data-id="${m.code.id}">
      <span class="dot" style="background:${esc(m.code.color)}"></span>
      <span class="suggest-name">${esc(m.identity)}</span>
      ${(depth.get(m.code.id)||0)>0?`<span class="suggest-tag">${QT('subLevel','sub-level')}</span>`:''}
    </button>`).join('');
  const createRow=(needle&&!exact)
    ? `<button class="suggest-row create" data-action="popup-create" data-name="${esc(needle)}">${esc(QT('createCodeTpl','＋ Create “%s” and code it').replace('%s',needle))}</button>`
    : '';
  const hint=ambiguous?`<div class="suggest-empty" role="status">${esc(QT('popupChoosePath'))}</div>`:'';
  box.innerHTML=(hint+rows+createRow)||'<div class="suggest-empty">'+esc(QT('noCodesYet','No codes yet — type a keyword to create one'))+'</div>';
}
function movePopupCursor(delta) {
  const rows=[...document.querySelectorAll('#code-suggest .suggest-row')];
  if(!rows.length) return;
  const next=Math.max(0,Math.min(rows.length-1,(state.popupCursor||0)+delta));
  state.popupCursor=next;
  state.popupCursorMoved=true;
  rows.forEach((r,i)=>r.classList.toggle('active',i===next));
  rows[next].scrollIntoView({block:'nearest'});
}
async function applyCodeById(codeId) {
  const sel=state.selection; if(!sel) return;
  await api(projectUrl('annotations'),{document_id:sel.document_id,start:sel.start,end:sel.end,code_id:codeId,memo:''});
  closeCodePopup(); state.selection=null;
  await refresh();
  toast(QT('toastCoded','Coded.'));
}
async function createAndApplyCode(name) {
  const code=await api(projectUrl(QT('codeCount','codes')),{name,definition:'',color:null});
  await refresh();
  await applyCodeById(code.id);
  toast(QT('toastCodeCreated','Created “%s” and coded it.').replace('%s',name));
}
async function submitCodePopup() {
  const input=$('#code-search'); if(!input) return;
  const q=input.value.trim();
  const matches=state.popupMatches||[];
  if(!state.popupCursorMoved&&matches.filter(m=>m.exact).length>1){
    toast(QT('popupChoosePath'),true);return;
  }
  const pick=matches[state.popupCursor||0];
  if(pick) return applyCodeById(pick.code.id);
  if(q) return createAndApplyCode(q);
  toast(QT('toastNeedKeyword','Type a keyword first, or pick a code from the list.'),true);
}
function locate(start) {
  if(state.search||state.codeFilter){state.search='';state.codeFilter=null;render();}
  const para=[...document.querySelectorAll('.paragraph')].find(el=>Number(el.dataset.start)<=start&&Number(el.dataset.end)>start);
  if(para){para.scrollIntoView({behavior:'smooth',block:'center'});para.classList.add('flash');setTimeout(()=>para.classList.remove('flash'),1800);}
}
function showImport() {
  modal(QT('importDlg','Import interview'), `<p class="io-intro">${QT('importShort')}</p>
    <div class="io-modes" role="group" aria-label="${QT('importDlg')}"><button type="button" data-action="import-mode" data-mode="file" aria-pressed="true">${icon('upload')}${QT('importFileMode')}</button><button type="button" data-action="import-mode" data-mode="paste" aria-pressed="false">${icon('doc')}${QT('importPasteMode')}</button></div>
    <div id="import-file-panel"><label class="field io-file-label"><span class="file-picker io-file-picker">${icon('upload')}<span><strong class="file-picker-button">${QT('chooseFile')}</strong><span class="file-picker-name" data-file-name="import-file">${QT('noFileSelected')}</span></span><input id="import-file" type="file" accept=".txt,.docx" aria-label="${QT('chooseFile')}"></span><small>${QT('importFormats')}</small></label><div id="import-preview" class="io-source-preview" hidden></div></div>
    <div id="import-paste-panel" hidden><label class="field">${QT('importPaste')}<textarea id="document-text" rows="6" placeholder="Interviewer: …&#10;Participant: …" disabled></textarea></label></div>
    <label class="field">${QT('importName')}<input id="document-name" placeholder="${QT('docNamePlaceholder')}" maxlength="200"></label>
    <details class="io-help"><summary>${QT('importHelp')}</summary><p>${QT('importDesc')}</p><p>${QT('fileHint')}</p></details>
    <button class="link io-table-link" data-action="import-export-open">${QT('importTableLink')} ↗</button>`,
    `<button data-action="close">${QT('cancel')}</button><button class="primary" data-action="save-document">${QT('importBtn')}</button>`);
  $('#dialog').dataset.workflow='import';
}
function setImportMode(mode) {
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
  const excluded=codeDescendants(id); excluded.add(id);
  const others=state.project.codes.filter(x=>!excluded.has(x.id));
  modal(QT('mergeCode','Merge code'), `<p>Move every coding from <b>${esc(src.name)}</b> into another code, then remove it.</p>
    <label class="field">Merge into<select id="merge-target"${others.length?'':' disabled'}>${others.map(o=>`<option value="${o.id}">${esc(codePath(o))}</option>`).join('')}</select></label>
    ${others.length?'':'<p class="notice">No eligible target: choose a code outside this branch.</p>'}
    <div class="notice">Sub-codes of <b>${esc(src.name)}</b> are re-parented to the target. A coding that would duplicate an existing target coding on the same passage is collapsed rather than copied.</div>`,
    `<button data-action="close">${QT('cancel','Cancel')}</button><button class="primary" data-action="code-merge" data-id="${id}"${others.length?'':' disabled'}>Merge</button>`);
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
Object.assign(_T.zh,{writeReport:'撰写／编辑研究报告',ctTitle:'编码原文对照',methodStatusTitle:'方法与报告写作状态',methodStatusNow:'当前支持原文编码、层级、备忘录、描述性计数、图表和编码原文导出。研究报告编辑器可保存、比较和恢复 Analysis Table／Narrative Analysis；TA 与内容分析有各自的人工审核清单。',methodStatusPlanned:'待实现：Comparative QCA 的校准、真值表和最简化。编码计数与共现不能代替配置分析。Word 内修改不会回写 QT。',ctLabels:'树形展示标签',ctSavedLabels:'保存的分组／编码',ctResearchLabels:'Theme 主题 → Category 类别 → Code 编码',ctRoleChoice:'选择适合码本的展示标签。三层样式分别标记有子项的根、中间组和叶节点；不改变已保存编码，也不自动形成研究主题。',ctIntro:'完整正文、精确高亮与已保存的编码树。Group／Code 只描述结构，不自动认定 Theme／Category 角色。',ctScope:'导出文档范围',ctCurrentDoc:'当前文档',ctAll:'全部文档',ctSelected:'选择多份文档',ctFullText:'完整正文，包含未编码语境',ctMemos:'包含文档、标注和编码备忘录',ctPrivate:'文件包含完整访谈正文，请私有保存。不含待采纳建议或阅读标记。',ctHtml:'下载 HTML',ctWord:'下载可编辑 Word',ctChecking:'正在核对旧导出版本…',ctCurrent:'编码证据版本一致。',ctStale:'证据已变化，请重新导出；旧文件保持原样。',ctCheckFailed:'无法核对旧导出，请检查范围并重新导出。',ctCheck:'核对上次导出版本',ctChoose:'请至少选择一份文档。',ctFrozen:'这是正文和编码树的冻结副本，项目编辑不会更新已有文件。'});
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
    <fieldset class="coded-export"><legend>${QT('ctTitle','Coded transcript')}</legend><p>${QT('ctIntro','Full source text, precise highlights and the saved code tree. Group / Code labels describe structure; Theme / Category roles are not inferred.')}</p><label class="field" for="coded-scope">${QT('ctScope','Documents to export')}<select id="coded-scope">${doc()?`<option value="current">${QT('ctCurrentDoc','Current document')} · ${esc(doc().name)}</option>`:''}<option value="all">${QT('ctAll','All documents')}</option><option value="selected">${QT('ctSelected','Choose documents')}</option></select></label><div id="coded-document-list" class="coded-document-list" hidden>${state.project.documents.map(d=>`<label><input type="checkbox" name="coded-document" value="${esc(d.id)}" ${d.id===state.docId?'checked':''}>${esc(d.name)}</label>`).join('')}</div><p id="coded-scope-summary" class="tiny-label"></p><label class="field" for="coded-roles">${QT('ctLabels','Tree display labels')}<select id="coded-roles"><option value="saved">${QT('ctSavedLabels','Saved Groups / Codes')}</option><option value="theme-category-code">${QT('ctResearchLabels','Theme → Category → Code')}</option></select></label><p class="reading-marks-help">${QT('ctRoleChoice','Choose the labels that fit your codebook. The three-label layout uses grouped roots, inner groups and leaves; it does not change saved codes or establish research themes.')}</p><label class="coded-memo-option"><input id="coded-memos" type="checkbox">${QT('ctMemos','Include document, coding and code memos')}</label><p class="tiny-label">${QT('ctPrivate','Contains full interview text. Keep the downloaded files private. Pending suggestions and reading marks are excluded.')}</p><div class="coded-export-actions"><button data-action="download-coded" data-format="coded-html">${QT('ctHtml','Download HTML')}</button><button data-action="download-coded" data-format="coded-docx">${QT('ctWord','Download editable Word')}</button></div><p id="coded-version-status" role="status" aria-live="polite"></p>${lastTranscriptExport?.projectId===state.project.id?`<button class="link" data-action="check-coded-export">${QT('ctCheck','Check previous export version')}</button>`:''}</fieldset><details class="report-status"><summary>${QT('methodStatusTitle','Methods and report writing')}</summary><p>${QT('methodStatusNow','Available: coding, hierarchy, memos, descriptive counts, figures and coded transcripts. The research report editor saves, compares and restores your Analysis Table and Narrative Analysis, with method-specific TA and Content Analysis review checklists.')}</p><p>${QT('methodStatusPlanned','Planned: Comparative QCA calibration, truth tables and minimisation. Coding counts and co-occurrence cannot replace configuration analysis. Word edits do not update QT.')}</p></details><div id="export-result" class="io-export-result" role="status" aria-live="polite"><div class="io-result-empty">${icon('down')}<span>${QT('exportChoose')}</span></div></div><p class="io-privacy">${QT('exportPrivate')}</p>`);
  $('#dialog').dataset.workflow='export';
  refreshTranscriptScope();
  if(lastTranscriptExport?.projectId===state.project.id)checkTranscriptVersion();
}
function exportResultHtml(filename,bytes,text) {
  const excerpt=cp(text.split('\n').slice(0,8).join('\n')).slice(0,1000).join('');
  return `<div class="io-result-heading">${icon('doc')}<div><span class="io-kicker">${QT('exportSent')}</span><strong data-export-filename>${esc(filename)}</strong><span>${bytes.toLocaleString()} B</span></div><span class="io-result-check" aria-hidden="true">✓</span></div><p>${QT('exportCheck')}</p><details class="io-export-preview"><summary>${QT('exportPreview')}</summary><pre>${esc(excerpt)}</pre></details>`;
}
async function createProject(body) {
  const p=await api('/api/projects',body); state.projects=await api('/api/projects');
  if(['empty','bologna'].includes(body.kind))setGuidePreference(p.id,'active');
  closeModal(); state.view='coding'; await loadProject(p.id); toast(QT('projectCreated','Project created and saved locally.'));
}
async function action(button) {
  const a=button.dataset.action;
  if(a==='write-report')return window.QTReport.open({project:state.project,lang:QT_LANG,readonly:state.config.public_demo,request:api,endpoint:projectUrl(),modal,onSaved:refresh,onLocate:locateReportEvidence,fetchFile:url=>fetch(url,{headers:{'X-QualiCraft-Token':state.token}})});
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
  if(a==='close'){closeModal();return;}
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
  if(a==='view'){state.view=button.dataset.view;state.selection=null;render();return;}
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
  if(a==='reading-resume'){readingOverviewNav=null;readingOverviewFocus=null;readingOverview.open=false;const saved=readReadingPosition(state.project,doc());if(saved){state.search='';state.codeFilter=null;state.sourceFocus=null;render();scrollReadingParagraph(saved.start,true);updateReadingPosition();}return;}
  if(a==='reading-tools'){const pane=$('#document-pane'),open=pane.classList.toggle('reading-tools-open');button.setAttribute('aria-expanded',String(open));return;}
  if(a==='coding-codebook')return showMobileCodebook();
  if(a==='filter-code'){const inBook=button.closest('#mobile-codebook-list');const fromTree=button.closest('.codebook-tree'),id=button.dataset.id;if(inBook){delete $('#dialog').dataset.codingCodebook;closeModal();}readingOverviewNav=null;readingOverviewFocus=null;state.codeFilter=state.codeFilter===button.dataset.id?null:button.dataset.id;state.view='coding';render();if(inBook)$('.reader-code-filter button')?.focus();else if(fromTree)[...document.querySelectorAll('#side-list [data-action="filter-code"]')].find(el=>el.dataset.id===id)?.focus({preventScroll:true});return;}
  if(a==='toggle-code'){const id=button.dataset.id;state.collapsed.has(id)?state.collapsed.delete(id):state.collapsed.add(id);refreshCodebooks(id,'toggle-code',button.closest('#mobile-codebook-list')?'mobile':'side');return;}
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
  if(a==='import-mode')return setImportMode(button.dataset.mode);
  if(a==='save-document'){
    const file=$('#import-file').disabled?null:$('#import-file').files[0];
    if(!$('#import-file').disabled&&!file)throw new Error(QT('importEmpty'));
    const body={name:$('#document-name').value||file?.name,text:$('#document-text').value};
    if(file){if(file.size>8_000_000)throw new Error('File exceeds 8 MB.'); if(/\.docx$/i.test(file.name)){const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));body.docx_base64=btoa(binary);delete body.text;}else if(/\.txt$/i.test(file.name)){body.text=new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());}else throw new Error('Choose a TXT or DOCX file.');}
    const d=await api(projectUrl('documents'),body);importedDocument(d.id);closeModal();await refresh();focusImportedDocument();toast(QT('interviewImported','Interview imported.'));return;
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
  if(a==='coding-locate'){const id=button.dataset.id;delete $('#dialog').dataset.codingId;closeModal();if(state.search||state.codeFilter){state.search='';state.codeFilter=null;render();}const mark=[...document.querySelectorAll('.passage mark[data-coding-ids]')].find(el=>JSON.parse(el.dataset.codingIds).includes(id));if(mark){mark.setAttribute('tabindex','-1');mark.scrollIntoView({block:'center',behavior:'auto'});mark.focus({preventScroll:true});previewCoding([id]);}return;}
  if(a==='annotation'){
    const annotation=state.project.annotations.find(x=>x.id===button.dataset.id);
    previewCoding([annotation.id]);
    modal(codesFor(annotation).name,`${codingDetailsHtml(annotation)}<label class="field">${QT('researchMemo','Research memo')}<textarea id="edit-memo" rows="4">${esc(annotation.memo)}</textarea></label>`,`<button class="danger" data-action="remove-annotation"${demoLock()} data-id="${annotation.id}">${QT('removeCoding','Remove coding')}</button><button class="primary" data-action="save-memo"${demoLock()} data-id="${annotation.id}">${QT('saveMemo','Save memo')}</button>`);
    $('#dialog').dataset.codingId=annotation.id;return;
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
  if(a==='plot-view')return showPlotViewer(button);
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
document.addEventListener('click',async e=>{const button=e.target.closest('[data-action]');if(!button||button.disabled)return;if(['import','export'].includes(button.dataset.action))ioReturnFocus=button;button.disabled=true;try{await action(button);}catch(error){errorDisplay(error);}finally{if(button.isConnected){button.disabled=button.dataset.action==='start-analysis'&&!$('#send-confirm')?.checked;if(button.dataset.action.startsWith('net-'))drawNetworkControls();}}});
document.addEventListener('close',e=>{if(e.target.id==='dialog'&&e.target.dataset.workflow&&ioReturnFocus?.isConnected&&!ioReturnFocus.disabled)ioReturnFocus.focus({preventScroll:true});},true);
document.addEventListener('click',e=>{
  const brick=e.target.closest('.brick'); if(!brick) return;
  const on=brick.classList.toggle('on');
  brick.setAttribute('aria-pressed',String(on));
  const state_=brick.querySelector('.brick-state'); if(state_) state_.textContent=on?QT('added','Added'):QT('add','Add');
});
document.addEventListener('change',async e=>{
  if(e.target.id==='coded-scope'||e.target.name==='coded-document'){refreshTranscriptScope();return;}
  if(e.target.dataset&&e.target.dataset.plot){state.plotOptions[e.target.dataset.plot]=e.target.value;render();return;}

  try{
    if(e.target.id==='network-select'){if(!e.target.value)clearNetworkSelection();else if(NET.selected!==e.target.value)toggleNetworkNode(e.target.value);return;}
    if(e.target.id==='start-project-select')$('[data-action="start-open"]').disabled=!e.target.value;
    if(e.target.id==='reading-document'){switchReadingDocument(e.target.value);return;}
    if(e.target.id==='project-select')await loadProject(e.target.value);
    if(e.target.id==='review-filter'){state.reviewFilter=e.target.value;render();}
    if(e.target.id==='send-confirm')$('[data-action="start-analysis"]').disabled=!e.target.checked;
    if(e.target.matches('input[type="file"]')&&e.target.files[0]){const label=document.querySelector('[data-file-name="'+e.target.id+'"]');if(label)label.textContent=e.target.files[0].name;if(e.target.id==='import-file'){$('#document-name').value=e.target.files[0].name.replace(/\.(txt|docx)$/i,'');await updateImportPreview();}}
    if(e.target.id==='restore-file'&&e.target.files[0]){if(e.target.files[0].size>20_000_000)throw new Error('Project file exceeds 20 MB.');await createProject({kind:'restore',project:JSON.parse(await e.target.files[0].text())});}
  }catch(error){errorDisplay(error);}
});
document.addEventListener('input',e=>{if(e.target.id==='mobile-code-filter'){state.sideFilter=e.target.value;refreshSideList();$('#mobile-codebook-list').innerHTML=codebookHtml('mobile');}else if(e.target.id==='search'){beginReadingSearch();readingOverviewNav=null;readingOverviewFocus=null;state.search=e.target.value;state.selection=null;closeCodePopup();$('#reader').innerHTML=readerHtml();mountReading(!state.search);}else if(e.target.id==='side-filter'){state.sideFilter=e.target.value;refreshSideList();}});
// Preview changes CSS only: no re-render, source text insertion or server write.
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
window.addEventListener('resize',()=>positionCodePopup());
window.addEventListener('scroll',scheduleReadingPosition,true);
window.addEventListener('resize',()=>{if(readingMounted&&!readingMounted.filtered&&readingMounted.start!==null)scrollReadingParagraph(readingMounted.start);scheduleReadingPosition();});
window.addEventListener('pagehide',captureReadingPosition);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')captureReadingPosition();});
async function init(){try{
  const boot=await api('/api/bootstrap');state.token=boot.token;state.projects=boot.projects;state.config=boot.config;
  const id=selectedStartupProject(state.projects,state.config.public_demo);if(id)await loadProject(id);else render();
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
