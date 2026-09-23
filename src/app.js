const PRESETS = [
  {id:"poster",width:680,height:1000,shape:"poster",mode:"cover",icon:"▯",faq:"8"},
  {id:"season-poster",width:680,height:1000,shape:"poster season",mode:"cover",icon:"▯",faq:"8"},
  {id:"background",width:1920,height:1080,shape:"wide",mode:"cover",icon:"▱",faq:"10"},
  {id:"clearlogo",width:800,height:310,shape:"logo",mode:"contain",icon:"━",faq:"96",gutter:10,pngOnly:true},
  {id:"banner",width:758,height:140,shape:"wide",mode:"cover",icon:"▱",faq:"11"},
  {id:"icon",width:1024,height:1024,shape:"square",mode:"cover",icon:"□",faq:"12"},
  {id:"clearart",width:1000,height:562,shape:"wide",mode:"contain",icon:"▱",faq:"95",pngOnly:true},
  {id:"episode-hd",width:640,height:360,shape:"wide",mode:"cover",icon:"▱",faq:"6"},
  {id:"episode-sd",width:640,height:480,shape:"poster",mode:"cover",icon:"▯",faq:"6"}
];

const COPY = {
 en:{
  privacyPill:"Files stay on your device",tvdbRules:"TheTVDB guidelines ↗",languageLabel:"Language",stepImage:"01 / IMAGE",fileStateEmpty:"No file yet",fileStateLoaded:"Image loaded",addImage:"Add an image",dropOrBrowse:"Drop it here or browse",removeImage:"Remove image",stepPreset:"02 / TVDB PRESET",chooseImageType:"Choose an image type",morePresets:"+ More TheTVDB formats",fewerPresets:"− Fewer formats",customSize:"Custom size",customRatio:"custom ratio",width:"Width",height:"Height",applySize:"Apply size",qualityTitle:"Keep the original quality",qualityCopy:"PNG encoding is lossless. JPEG is lossy. Cropping or resizing changes pixels, and small sources are never silently enlarged.",
  pageTitle:"Artwork, precisely framed",pageIntro:"Choose a preset, position the crop and export.",localBadge:"⌘ &nbsp;Processed locally",centerImage:"Center image",centered:"Centered",moved:"Moved",canvasReady:"Your canvas is ready",canvasHint:"Add an image on the left<br>to adjust its crop.",dragToMove:"Drag to reposition",stageCaption:"Drag to reposition · use Center image for exact alignment",position:"POSITION",nudgeHint:"Move in small steps",zoom:"ZOOM",choosePresetGuideline:"Choose a preset to see its guidelines",guidelineIntro:"TheTVDB dimensions and artwork reminders appear here.",viewRules:"View rules ↗",generalRules:"General guidelines ↗",customPreset:"Custom size",customGuideline:"Custom dimensions are not an official TheTVDB preset. Check the linked artwork rules before uploading.",customTitle:"Custom dimensions set",stepOutput:"03 / OUTPUT",canvasSize:"CANVAS SIZE",exactPixels:"pixels · exact",checksTitle:"Checks",sourceResolution:"Source resolution",alignment:"Alignment",fileSize:"Source file size",addImageCheck:"Add an image",centeredOnCanvas:"Centered on the canvas",tvdbLimit:"TheTVDB upload limit: 10 MB",tooSmallCover:"Too small for this crop · choose a larger source",tooSmallContain:"Source dimensions are below the TheTVDB minimum",sourceDimensions:"{width} × {height} px · no upscaling",exactlyCentered:"Exactly centered",imageMoved:"Image is repositioned",under10:"{size} · under 10 MB",checkExportSize:"{size} · check the exported file size",
  seasonLabel:"Season label",addSeasonLabel:"Add season label",seasonGuidance:"A label alone does not make artwork season-specific. Use relevant season imagery or a series logo; season 1 is an exception.",autoStyle:"Find a clear spot & match contrast",seasonNumber:"Season number",seasonPrefix:"Season",labelPosition:"Label position",textColor:"Text color",badgeColor:"Badge color",typeStyle:"Type style",position_bottom_left:"Bottom left",position_bottom_center:"Bottom center",position_bottom_right:"Bottom right",position_top_left:"Top left",position_top_center:"Top center",position_top_right:"Top right",autoStatus:"Placed at {position}; colors sampled from that area.",autoNeedsImage:"Add an image first to find a clear spot.",autoFailed:"Could not inspect this image. Choose a position manually.",
  exportTitle:"Export",fileFormat:"File format",pngOption:"PNG · lossless",jpegOption:"JPEG · smaller file",formatPng:"PNG preserves transparency and adds no encoding loss. Cropping and resizing can still change pixels.",formatJpeg:"JPEG is lossy and does not support transparency. PNG encoding is lossless.",formatPngRequired:"TheTVDB requires transparent PNG artwork for this preset. JPEG is disabled.",jpegQuality:"JPEG quality",transparentBackground:"Background for transparency",download:"↓ &nbsp;Download {format}",addImageToExport:"Add an image to export.",upscaleBlocked:"The source would need upscaling. TheTVDB advises against this; choose a larger image.",underfilledSource:"A larger source is needed to meet the TheTVDB minimum dimensions.",readyToExport:"Ready to export as {format}.",sourceFileBig:"Source file is over 10 MB. Check the exported file size before uploading.",chooseImageError:"Choose a PNG, JPG, WebP or AVIF image.",openImageError:"This image could not be opened.",customSizeError:"Choose a width and height between 1 and 12,000 pixels.",customTooLarge:"This canvas exceeds 40 megapixels. Choose smaller dimensions.",preparing:"Preparing your file…",exportFailed:"Export failed. Try another image.",downloaded:"Downloaded · {size} · {width} × {height} px.",downloadedTooBig:"Downloaded · {size}. This exceeds TheTVDB's 10 MB upload limit.",privacyTitle:"Private by design",privacyCopy:"Images are processed in your browser and never uploaded.",footerCopy:"Made for TheTVDB artwork · TheTVDB decides what it accepts.",
  "preset_poster":"Poster","preset_season-poster":"Season poster","preset_background":"Background","preset_clearlogo":"ClearLogo","preset_banner":"Banner","preset_icon":"Icon","preset_clearart":"ClearArt","preset_episode-hd":"Episode · HD","preset_episode-sd":"Episode · SD",
  "guide_poster":"680 × 1000 px. Use a series-level poster that represents the whole series, not a specific season or episode. Do not stretch or upscale it.","guide_season-poster":"680 × 1000 px. Identify the season and use season-relevant imagery or a series logo. Season 1 is exempt from the season identifier requirement; cast shown must belong to that season.","guide_background":"1920 × 1080 px. Fill the frame with unique artwork. Do not add borders, masks, vignettes or a poster on a plain background. Avoid spoilers and watermarks.","guide_clearlogo":"800 × 310 px · transparent PNG only. Center the series or movie logo with a 10 px gutter; fill up to 780 × 290 px without stretching. It should remain visible on light and dark backgrounds.","guide_banner":"758 × 140 px. Keep all logo text legible and complete. For a blank banner, leave the left side clear for TheTVDB's generated text.","guide_icon":"1024 × 1024 px. Center the artwork and use most of the square without cropping logos or stretching a poster. Check visibility on light and dark backgrounds.","guide_clearart":"1000 × 562 px · transparent PNG only. Include recognizable characters or objects and the series logo. No solid background, extra text or cropped logo; keep transparency clean.","guide_episode-hd":"640 × 360 px for HD. Use a unique image that represents the episode. Avoid spoilers, title cards, subtitles and watermarks; keep the original aspect ratio.","guide_episode-sd":"640 × 480 px for SD. Use the episode's original 4:3 broadcast image. Avoid added bars, spoilers, title cards, subtitles and watermarks.",
  generalGuidelines:"No spoilers, nudity, vulgarity, unrelated logos or watermarks. Do not stretch or upscale artwork; crop larger images and use only sufficiently large sources. Where artwork contains text, choose the correct primary language when uploading."
 },
 nl:{
  privacyPill:"Bestanden blijven op je apparaat",tvdbRules:"TheTVDB-richtlijnen ↗",languageLabel:"Taal",stepImage:"01 / AFBEELDING",fileStateEmpty:"Nog geen bestand",fileStateLoaded:"Afbeelding geladen",addImage:"Afbeelding toevoegen",dropOrBrowse:"Sleep hierheen of blader",removeImage:"Afbeelding verwijderen",stepPreset:"02 / TVDB-PRESET",chooseImageType:"Kies een afbeeldingstype",morePresets:"+ Meer TheTVDB-formaten",fewerPresets:"− Minder formaten",customSize:"Aangepast formaat",customRatio:"eigen verhouding",width:"Breedte",height:"Hoogte",applySize:"Formaat toepassen",qualityTitle:"Behoud de oorspronkelijke kwaliteit",qualityCopy:"PNG-codering is verliesvrij. JPEG is verliesgevend. Bijsnijden of verkleinen verandert pixels; kleine bronafbeeldingen worden nooit stilzwijgend vergroot.",
  pageTitle:"Artwork precies uitsnijden",pageIntro:"Kies een preset, bepaal de uitsnede en exporteer.",localBadge:"⌘ &nbsp;Lokaal verwerkt",centerImage:"Centreer afbeelding",centered:"Gecentreerd",moved:"Verplaatst",canvasReady:"Je canvas staat klaar",canvasHint:"Voeg links een afbeelding toe<br>om de uitsnede te bepalen.",dragToMove:"Sleep om te verschuiven",stageCaption:"Sleep om te verschuiven · centreer exact met de knop",position:"POSITIE",nudgeHint:"Verplaats stap voor stap",zoom:"ZOOM",choosePresetGuideline:"Kies een preset voor de richtlijnen",guidelineIntro:"TheTVDB-afmetingen en aandachtspunten verschijnen hier.",viewRules:"Bekijk regels ↗",generalRules:"Algemene richtlijnen ↗",customPreset:"Aangepast formaat",customGuideline:"Dit zijn aangepaste afmetingen, geen officiële TheTVDB-preset. Controleer de gekoppelde artworkregels voor je uploadt.",customTitle:"Aangepaste afmetingen ingesteld",stepOutput:"03 / UITVOER",canvasSize:"CANVASFORMAAT",exactPixels:"pixels · exact",checksTitle:"Controle",sourceResolution:"Bronresolutie",alignment:"Uitlijning",fileSize:"Bestandsgrootte bron",addImageCheck:"Voeg een afbeelding toe",centeredOnCanvas:"Gecentreerd in het canvas",tvdbLimit:"TheTVDB-uploadlimiet: 10 MB",tooSmallCover:"Te klein voor deze uitsnede · kies een grotere bron",tooSmallContain:"Bronafmetingen zijn kleiner dan het TheTVDB-minimum",sourceDimensions:"{width} × {height} px · niet opgeschaald",exactlyCentered:"Exact gecentreerd",imageMoved:"Afbeelding is verschoven",under10:"{size} · minder dan 10 MB",checkExportSize:"{size} · controleer bestandsgrootte na export",
  seasonLabel:"Seizoenslabel",addSeasonLabel:"Seizoenslabel toevoegen",seasonGuidance:"Een label alleen maakt artwork niet seizoensspecifiek. Gebruik relevante seizoensbeelden of een serielogo; seizoen 1 is een uitzondering.",autoStyle:"Zoek een rustige plek en passend contrast",seasonNumber:"Seizoennummer",seasonPrefix:"Seizoen",labelPosition:"Positie van label",textColor:"Tekstkleur",badgeColor:"Labelkleur",typeStyle:"Letterstijl",position_bottom_left:"Linksonder",position_bottom_center:"Midden onder",position_bottom_right:"Rechtsonder",position_top_left:"Linksboven",position_top_center:"Midden boven",position_top_right:"Rechtsboven",autoStatus:"Geplaatst op {position}; kleuren afgestemd op dat gebied.",autoNeedsImage:"Voeg eerst een afbeelding toe om een rustige plek te vinden.",autoFailed:"Deze afbeelding kon niet worden bekeken. Kies zelf een positie.",
  exportTitle:"Exporteren",fileFormat:"Bestandsformaat",pngOption:"PNG · verliesvrij",jpegOption:"JPEG · kleiner bestand",formatPng:"PNG bewaart transparantie en voegt geen coderingsverlies toe. Bijsnijden en verkleinen kunnen pixels wel veranderen.",formatJpeg:"JPEG is verliesgevend en ondersteunt geen transparantie. PNG-codering is verliesvrij.",formatPngRequired:"Voor deze preset vereist TheTVDB transparante PNG-artwork. JPEG is uitgeschakeld.",jpegQuality:"JPEG-kwaliteit",transparentBackground:"Achtergrond bij transparantie",download:"↓ &nbsp;Download {format}",addImageToExport:"Voeg een afbeelding toe om te exporteren.",upscaleBlocked:"De bron zou opgeschaald moeten worden. TheTVDB raadt dat af; kies een grotere afbeelding.",underfilledSource:"Een grotere bron is nodig om aan de minimale TheTVDB-afmetingen te voldoen.",readyToExport:"Klaar om te exporteren als {format}.",sourceFileBig:"De bron is groter dan 10 MB. Controleer de bestandsgrootte na export.",chooseImageError:"Kies een PNG-, JPG-, WebP- of AVIF-afbeelding.",openImageError:"Deze afbeelding kan niet worden geopend.",customSizeError:"Kies een breedte en hoogte tussen 1 en 12.000 pixels.",customTooLarge:"Dit canvas is groter dan 40 megapixels. Kies kleinere afmetingen.",preparing:"Bestand wordt klaargemaakt…",exportFailed:"Exporteren is mislukt. Probeer een andere afbeelding.",downloaded:"Gedownload · {size} · {width} × {height} px.",downloadedTooBig:"Gedownload · {size}. Dit overschrijdt de TheTVDB-uploadlimiet van 10 MB.",privacyTitle:"Privé by design",privacyCopy:"Afbeeldingen worden in je browser verwerkt en nooit geüpload.",footerCopy:"Gemaakt voor TheTVDB-artwork · TheTVDB bepaalt wat wordt toegelaten.",
  "preset_poster":"Poster","preset_season-poster":"Seizoenposter","preset_background":"Achtergrond","preset_clearlogo":"ClearLogo","preset_banner":"Banner","preset_icon":"Pictogram","preset_clearart":"ClearArt","preset_episode-hd":"Aflevering · HD","preset_episode-sd":"Aflevering · SD",
  "guide_poster":"680 × 1000 px. Gebruik een serieposter die de hele serie weergeeft, niet één seizoen of aflevering. Rek de afbeelding niet uit en schaal haar niet op.","guide_season-poster":"680 × 1000 px. Vermeld het seizoen en gebruik seizoensspecifieke beelden of een serielogo. Seizoen 1 hoeft niet als seizoen herkenbaar te zijn; afgebeelde acteurs moeten bij dat seizoen horen.","guide_background":"1920 × 1080 px. Vul het kader met uniek artwork. Voeg geen randen, maskers of vignetten toe en plaats geen poster op een egale achtergrond. Vermijd spoilers en watermerken.","guide_clearlogo":"800 × 310 px · alleen transparante PNG. Centreer het serie- of filmlogo met 10 px marge; vul maximaal 780 × 290 px zonder vervorming. Het logo moet zichtbaar blijven op lichte en donkere achtergronden.","guide_banner":"758 × 140 px. Houd alle logotekst leesbaar en volledig zichtbaar. Laat bij een lege banner links ruimte voor automatisch toegevoegde tekst van TheTVDB.","guide_icon":"1024 × 1024 px. Centreer het artwork en benut het vierkante vlak zonder logo's af te snijden of een poster uit te rekken. Controleer zichtbaarheid op lichte en donkere achtergronden.","guide_clearart":"1000 × 562 px · alleen transparante PNG. Gebruik herkenbare personages of voorwerpen en het serielogo. Geen egale achtergrond, extra tekst of afgesneden logo; behoud schone transparantie.","guide_episode-hd":"640 × 360 px voor HD. Gebruik een uniek beeld dat de aflevering weergeeft. Vermijd spoilers, titelkaarten, ondertiteling en watermerken; behoud de oorspronkelijke verhouding.","guide_episode-sd":"640 × 480 px voor SD. Gebruik het oorspronkelijke 4:3-uitzendbeeld van de aflevering. Voeg geen balken toe en vermijd spoilers, titelkaarten, ondertiteling en watermerken.",
  generalGuidelines:"Geen spoilers, naaktheid, grofheid, irrelevante logo's of watermerken. Rek artwork niet uit en schaal het niet op; snijd grotere beelden bij en gebruik alleen bronnen met voldoende resolutie. Kies bij tekst in de afbeelding de juiste primaire taal wanneer je uploadt."
 }
};

Object.assign(COPY.en,{boardAria:"Drag the image or use the arrow keys to move the crop",up:"Up",left:"Left",down:"Down",right:"Right",styleModern:"Modern",styleClassic:"Classic",styleCondensed:"Condensed",transparency:"Transparency",transparencyOptional:"Only required for ClearLogo and ClearArt",transparencyOk:"Transparent pixels detected in the source",transparencyMissing:"The source appears opaque. Choose a PNG with actual transparency.",generalGuidelines:"No spoilers, nudity, vulgarity, unrelated logos or watermarks. Do not stretch or upscale; crop larger images and use sufficiently large sources. Avoid duplicates or minor variants, and keep season or episode text off series-level art. If text appears, select its primary language when uploading. TheTVDB limits uploads to three images per type for each series, season or movie."});
Object.assign(COPY.nl,{boardAria:"Sleep de afbeelding of gebruik de pijltjestoetsen om de uitsnede te verplaatsen",up:"Omhoog",left:"Naar links",down:"Omlaag",right:"Naar rechts",styleModern:"Modern",styleClassic:"Klassiek",styleCondensed:"Compact",transparency:"Transparantie",transparencyOptional:"Alleen nodig voor ClearLogo en ClearArt",transparencyOk:"Transparante pixels gevonden in de bron",transparencyMissing:"De bron lijkt ondoorzichtig. Kies een PNG met echte transparantie.",generalGuidelines:"Geen spoilers, naaktheid, grofheid, irrelevante logo's of watermerken. Rek niet uit en schaal niet op; snijd grotere beelden bij en gebruik bronnen met voldoende resolutie. Vermijd duplicaten en kleine varianten, en zet geen seizoens- of afleveringstekst op serie-artwork. Selecteer bij tekst de primaire taal wanneer je uploadt. TheTVDB staat maximaal drie afbeeldingen per type per serie, seizoen of film toe."});

Object.assign(COPY.en,{
 themeDarkLabel:"Switch to dark mode",themeLightLabel:"Switch to light mode",
 formatPng:"PNG keeps transparency. JPEG fills transparent areas with a background color and is available for presets that do not require transparency.",formatJpeg:"JPEG is smaller but lossy. Any transparent areas are filled with the selected background color.",formatPngRequired:"ClearLogo and ClearArt require PNG transparency. JPEG is unavailable for these presets; choose another preset to export JPEG.",
 clearlogoSummary:"ClearLogo has strict transparency and alignment requirements. Use this checklist to prepare a file that is ready to upload.",clearlogoChecklist:"ClearLogo upload checklist",clearlogoIntro:"Check every point before exporting and uploading.",
 clearlogoCanvasTitle:"Canvas and source size",clearlogoCanvasCopy:"Use a source of at least 800 × 310 px and export an exact 800 × 310 px canvas. Keep the logo's proportions; never stretch it.",
 clearlogoAlphaTitle:"Real transparency",clearlogoAlphaCopy:"Use a PNG with transparent pixels around the logo. A checkerboard is only a preview; it does not prove that the source is transparent.",
 clearlogoCenterTitle:"Center and size the visible logo",clearlogoCenterCopy:"Center the non-transparent artwork, not the file edges. Fill the 780 × 290 px safe area as much as possible without stretching; keep the logo itself out of the 10 px gutter. A drop shadow or glow may extend into the gutter.",
 clearlogoSizeTitle:"Keep the original scale",clearlogoSizeCopy:"Use a crisp, sufficiently large source. Do not enlarge or distort it; crop a larger image if needed.",
 clearlogoContrastTitle:"Check both backgrounds",clearlogoContrastCopy:"Make sure the logo is easy to see on light and dark backgrounds. Keep the background transparent; an outline or glow can help. Avoid pure white or pure black logos.",
 clearlogoContentTitle:"Keep it relevant",clearlogoContentCopy:"Use only the series or movie logo. No spoilers, nudity, vulgarity, watermarks, unrelated logos, or extra text. Keep season/episode text off series-level artwork. Avoid duplicates and minor variants.",
 clearlogoLanguageTitle:"Language and upload limit",clearlogoLanguageCopy:"Select the primary language when the logo contains text. TheTVDB allows at most 3 ClearLogo images per series, season, or movie.",
 clearlogoFootnote:"Keep the exported PNG under TheTVDB's 10 MB upload limit."
});
Object.assign(COPY.nl,{
 themeDarkLabel:"Schakel naar donkere modus",themeLightLabel:"Schakel naar lichte modus",
 formatPng:"PNG behoudt transparantie. JPEG vult transparante delen met een achtergrondkleur en is beschikbaar bij presets die geen transparantie vereisen.",formatJpeg:"JPEG is kleiner maar verliesgevend. Transparante delen worden gevuld met de gekozen achtergrondkleur.",formatPngRequired:"ClearLogo en ClearArt vereisen een transparante PNG. JPEG is voor deze presets niet beschikbaar; kies een andere preset om als JPEG te exporteren.",
 clearlogoSummary:"Voor ClearLogo gelden strikte eisen voor transparantie en uitlijning. Met deze checklist maak je het bestand klaar voor upload.",clearlogoChecklist:"ClearLogo-uploadchecklist",clearlogoIntro:"Loop alle punten na voordat je exporteert en uploadt.",
 clearlogoCanvasTitle:"Canvas- en bronformaat",clearlogoCanvasCopy:"Gebruik een bron van minimaal 800 × 310 px en exporteer een canvas van exact 800 × 310 px. Behoud de verhoudingen van het logo en rek het nooit uit.",
 clearlogoAlphaTitle:"Echte transparantie",clearlogoAlphaCopy:"Gebruik een PNG met transparante pixels rondom het logo. Een schaakbord is alleen een voorbeeldweergave; het bewijst niet dat de bron transparant is.",
 clearlogoCenterTitle:"Centreer en schaal het zichtbare logo",clearlogoCenterCopy:"Centreer het niet-transparante artwork, niet de randen van het bronbestand. Vul het veilige vlak van 780 × 290 px zo veel mogelijk zonder uitrekken; houd het logo zelf buiten de marge van 10 px. Een schaduw of gloed mag wel in die marge vallen.",
 clearlogoSizeTitle:"Behoud de oorspronkelijke schaal",clearlogoSizeCopy:"Gebruik een scherpe bron met voldoende pixels. Vergroot of vervorm die niet; snijd een grotere afbeelding indien nodig bij.",
 clearlogoContrastTitle:"Controleer lichte en donkere achtergronden",clearlogoContrastCopy:"Zorg dat het logo op beide goed zichtbaar is. Behoud een transparante achtergrond; een omlijning of gloed kan helpen. Vermijd volledig witte of zwarte logo's.",
 clearlogoContentTitle:"Gebruik alleen relevant artwork",clearlogoContentCopy:"Gebruik alleen het serie- of filmlogo; geen spoilers, naaktheid, grofheid, watermerken, irrelevante logo's of extra tekst. Geen seizoens-/afleveringstekst op serie-artwork. Vermijd duplicaten en kleine varianten.",
 clearlogoLanguageTitle:"Taal en uploadlimiet",clearlogoLanguageCopy:"Kies bij tekst de primaire taal. TheTVDB staat maximaal 3 ClearLogo-afbeeldingen per serie, seizoen of film toe.",
 clearlogoFootnote:"Houd de geëxporteerde PNG onder de uploadlimiet van 10 MB van TheTVDB."
});

const state={preset:PRESETS[0],custom:false,file:null,image:null,url:null,hasTransparency:false,alphaBounds:null,shiftX:0,shiftY:0,zoom:1,dragging:false,pointerX:0,pointerY:0,language:"en"};
const $=(s)=>document.querySelector(s);
const ui={
 input:$("#file-input"),drop:$("#drop-zone"),fileState:$("#file-state"),fileDetails:$("#file-details"),fileName:$("#file-name"),fileSize:$("#file-size"),remove:$("#remove-image"),language:$("#language-select"),theme:$("#theme-toggle"),
 presetGrid:$("#preset-grid"),more:$("#more-presets"),extra:$("#extra-presets"),customW:$("#custom-width"),customH:$("#custom-height"),applyCustom:$("#apply-custom"),
 presetName:$("#selected-preset-name"),presetIcon:$("#selected-preset-icon"),dimensions:$("#selected-dimensions"),outputSize:$("#output-size"),
 stage:$("#stage"),board:$("#artboard"),image:$("#preview-image"),empty:$("#empty-state"),safe:$("#logo-safe-area"),stamp:$("#season-stamp"),dragHint:$("#drag-hint"),
 centerStatus:$("#center-status"),centerText:$("#center-status-text"),center:$("#center-image"),zoom:$("#zoom-slider"),zoomValue:$("#zoom-value"),
 resolution:$("#resolution-check"),resolutionText:$("#resolution-copy"),transparency:$("#transparency-check"),transparencyText:$("#transparency-copy"),alignment:$("#alignment-check"),alignmentText:$("#alignment-copy"),limit:$("#file-limit-check"),limitText:$("#file-limit-copy"),
 guide:$("#guideline-card"),guideTitle:$("#guideline-title"),guideCopy:$("#guideline-copy"),guideLink:$("#guideline-link"),clearlogoGuide:$("#clearlogo-guide"),
 seasonPanel:$("#season-panel"),seasonToggle:$("#season-toggle"),seasonNumber:$("#season-number"),stampPosition:$("#stamp-position"),stampColor:$("#stamp-color"),stampBackground:$("#stamp-background-color"),stampStyle:$("#stamp-style"),autoStyle:$("#auto-season-style"),autoStatus:$("#season-auto-status"),
 format:$("#format-select"),formatNote:$("#format-note"),jpegOptions:$("#jpeg-options"),jpegQuality:$("#jpeg-quality"),jpegQualityValue:$("#jpeg-quality-value"),jpegBackground:$("#jpeg-background"),
 download:$("#download-button"),message:$("#export-message")
};

function t(key,values={}){
 let text=COPY[state.language]?.[key]??COPY.en[key]??key;
 for(const [name,value] of Object.entries(values))text=text.split("{"+name+"}").join(String(value));
 return text;
}
function presetById(id){return PRESETS.find((p)=>p.id===id)}
function presetLabel(p){return t("preset_"+p.id)}
function bytesLabel(n){
 const locale=state.language==="nl"?"nl-NL":"en-US";
 return n<1024*1024?new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(Math.max(1,Math.round(n/1024)))+" KB":new Intl.NumberFormat(locale,{minimumFractionDigits:1,maximumFractionDigits:1}).format(n/(1024*1024))+" MB";
}
function makePresetButton(p){
 const b=document.createElement("button");b.type="button";b.className="preset-card";b.dataset.preset=p.id;b.setAttribute("aria-pressed",state.preset.id===p.id?"true":"false");
 const mini=document.createElement("span");mini.className="preset-mini "+p.shape;mini.setAttribute("aria-hidden","true");
 const text=document.createElement("span");text.className="preset-text";const title=document.createElement("strong");title.textContent=presetLabel(p);
 const size=document.createElement("small");size.textContent=p.width+" × "+p.height;text.append(title,size);b.append(mini,text);b.addEventListener("click",()=>choosePreset(p));return b;
}
function renderPresets(){
 ui.presetGrid.replaceChildren();ui.extra.replaceChildren();ui.presetGrid.setAttribute("aria-label",t("chooseImageType"));
 ["poster","season-poster","background","clearlogo"].forEach((id)=>ui.presetGrid.append(makePresetButton(presetById(id))));
 ["banner","icon","clearart","episode-hd","episode-sd"].forEach((id)=>ui.extra.append(makePresetButton(presetById(id))));
 document.querySelectorAll(".preset-card").forEach((b)=>{const active=b.dataset.preset===state.preset.id;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active))});
 ui.more.textContent=ui.extra.hidden?t("morePresets"):t("fewerPresets");
}
function choosePreset(p){
 state.preset=p;state.custom=false;state.shiftX=0;state.shiftY=0;state.zoom=1;ui.seasonPanel.hidden=p.id!=="season-poster";
 if(p.id==="season-poster")ui.seasonToggle.checked=true;renderPresets();updateFormat();paint();if(p.id==="season-poster")autoSeasonStyle();
}
function updatePresetInfo(){
 const p=state.preset;ui.presetName.textContent=state.custom?t("customPreset"):presetLabel(p);ui.presetIcon.textContent=state.custom?"⌗":p.icon;
 ui.dimensions.textContent=p.width+" × "+p.height+" px";ui.outputSize.innerHTML=p.width+" <i>×</i> "+p.height;ui.seasonPanel.hidden=p.id!=="season-poster";
 ui.guideTitle.textContent=state.custom?t("customTitle"):p.width+" × "+p.height+" px · "+presetLabel(p);
 ui.clearlogoGuide.hidden=state.custom||p.id!=="clearlogo";
 ui.guideCopy.textContent=state.custom?t("customGuideline"):p.id==="clearlogo"?t("clearlogoSummary"):t("guide_"+p.id)+" "+t("generalGuidelines");
 ui.guideLink.href="https://support.thetvdb.com/kb/faq.php?id="+(state.custom?"1":p.faq);ui.guideLink.textContent=state.custom?t("generalRules"):t("viewRules");ui.guide.classList.remove("warning","error");
}
function geometry(){
 if(!state.image)return null;
 const p=state.preset,w=p.width,h=p.height,sw=state.image.naturalWidth,sh=state.image.naturalHeight;
 const bounds=p.id==="clearlogo"&&state.alphaBounds?state.alphaBounds:{left:0,top:0,right:sw,bottom:sh};
 const contentW=bounds.right-bounds.left,contentH=bounds.bottom-bounds.top;
 const idealScale=p.mode==="contain"?Math.min((w-2*(p.gutter||0))/contentW,(h-2*(p.gutter||0))/contentH):Math.max(w/sw,h/sh);
 let base=idealScale;if(p.mode==="contain")base=Math.min(1,base);
 const scale=base*state.zoom,dw=sw*scale,dh=sh*scale;
 const originX=p.id==="clearlogo"?(w-contentW*scale)/2-bounds.left*scale:(w-dw)/2;
 const originY=p.id==="clearlogo"?(h-contentH*scale)/2-bounds.top*scale:(h-dh)/2;
 let x=originX+state.shiftX,y=originY+state.shiftY;
 if(p.mode==="cover"){x=Math.min(0,Math.max(w-dw,x));y=Math.min(0,Math.max(h-dh,y))}
 else if(p.id==="clearlogo"){
  const gutter=p.gutter||0,minX=gutter-bounds.left*scale,maxX=w-gutter-bounds.right*scale,minY=gutter-bounds.top*scale,maxY=h-gutter-bounds.bottom*scale;
  x=Math.min(maxX,Math.max(minX,x));y=Math.min(maxY,Math.max(minY,y));
 }else{const gutter=p.gutter||0;x=Math.min(w-gutter-dw,Math.max(gutter,x));y=Math.min(h-gutter-dh,Math.max(gutter,y))}
 return {w,h,sw,sh,scale,dw,dh,x,y,base,idealScale,mode:p.mode,contentBounds:bounds,originX,originY};
}
function constrainPosition(){const g=geometry();if(!g)return;state.shiftX=g.x-g.originX;state.shiftY=g.y-g.originY}
function sizeBoard(){
 const ratio=state.preset.width/state.preset.height,maxW=Math.max(120,Math.min(ui.stage.clientWidth-42,820)),maxH=Math.max(120,Math.min(ui.stage.clientHeight-75,580));
 let w=Math.min(maxW,maxH*ratio),h=w/ratio;if(h>maxH){h=maxH;w=h*ratio}ui.board.style.width=Math.round(w)+"px";ui.board.style.height=Math.round(h)+"px";
}
function hexRgba(hex,alpha){
 const parts=String(hex).replace("#","").match(/^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
 return parts?"rgba("+parseInt(parts[1],16)+","+parseInt(parts[2],16)+","+parseInt(parts[3],16)+","+alpha+")":"rgba(23,20,28,"+alpha+")";
}
function stampPreview(){
 const shown=state.preset.id==="season-poster"&&ui.seasonToggle.checked;ui.stamp.hidden=!shown;if(!shown)return;
 const n=Math.max(0,Math.min(99,Number(ui.seasonNumber.value)||0));ui.seasonNumber.value=String(n);ui.stamp.textContent=t("seasonPrefix")+" "+n;
 ui.stamp.className="season-stamp position-"+ui.stampPosition.value;ui.stamp.style.color=ui.stampColor.value;ui.stamp.style.backgroundColor=hexRgba(ui.stampBackground.value,.9);
 const fonts={sans:'Inter,"Segoe UI",Arial,sans-serif',serif:'Georgia,"Times New Roman",serif',condensed:'"Arial Narrow","Segoe UI",sans-serif'};
 ui.stamp.style.fontFamily=fonts[ui.stampStyle.value]||fonts.sans;ui.stamp.style.fontSize=Math.max(8,state.preset.width*.038*(ui.board.clientWidth/state.preset.width))+"px";
}
function autoSeasonStyle(){
 if(!state.image){ui.autoStatus.textContent=t("autoNeedsImage");return}
 try{
  const g=geometry(),canvas=document.createElement("canvas");canvas.width=120;canvas.height=176;const ctx=canvas.getContext("2d",{willReadFrequently:true});if(!ctx)throw new Error("Canvas unavailable");
  ctx.fillStyle="#d8d6dc";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(state.image,g.x,g.y,g.dw,g.dh,0,0,canvas.width,canvas.height);
  const regions=[
   {value:"top-left",x:6,y:6,w:38,h:26},{value:"top-right",x:76,y:6,w:38,h:26},{value:"bottom-left",x:6,y:144,w:38,h:26},
   {value:"bottom-right",x:76,y:144,w:38,h:26},{value:"top-center",x:41,y:6,w:38,h:26},{value:"bottom-center",x:41,y:144,w:38,h:26}
  ];let best=null;
  for(const region of regions){
   const data=ctx.getImageData(region.x,region.y,region.w,region.h).data;let count=0,sumL=0,sumL2=0,sumR=0,sumG=0,sumB=0;
   for(let i=0;i<data.length;i+=16){const r=data[i],green=data[i+1],b=data[i+2],l=.2126*r+.7152*green+.0722*b;count++;sumL+=l;sumL2+=l*l;sumR+=r;sumG+=green;sumB+=b}
   const mean=sumL/count,variance=Math.max(0,sumL2/count-mean*mean);if(!best||variance<best.variance)best={...region,variance,mean,r:Math.round(sumR/count),g:Math.round(sumG/count),b:Math.round(sumB/count)};
  }
  ui.stampPosition.value=best.value;ui.stampBackground.value="#"+[best.r,best.g,best.b].map((v)=>v.toString(16).padStart(2,"0")).join("");ui.stampColor.value=best.mean>148?"#17141c":"#ffffff";
  ui.autoStatus.textContent=t("autoStatus",{position:t("position_"+best.value)});stampPreview();
 }catch{ui.autoStatus.textContent=t("autoFailed")}
}
function checkClass(node,name,symbol){node.classList.remove("neutral","ok","warn","bad");node.classList.add(name);node.querySelector(".check-symbol").textContent=symbol}
function updateChecks(){
 if(!state.image){
  checkClass(ui.resolution,"neutral","•");ui.resolutionText.textContent=t("addImageCheck");checkClass(ui.transparency,"neutral","•");ui.transparencyText.textContent=t("transparencyOptional");checkClass(ui.alignment,"neutral","•");ui.alignmentText.textContent=t("centeredOnCanvas");
  checkClass(ui.limit,"neutral","•");ui.limitText.textContent=t("tvdbLimit");ui.centerStatus.classList.remove("off-center");ui.centerText.textContent=t("centered");ui.download.disabled=true;ui.message.textContent=t("addImageToExport");ui.message.className="export-message";return;
 }
 const g=geometry(),tooSmallCover=g.mode==="cover"&&g.scale>1.0001,tooSmallContain=g.mode==="contain"&&(g.sw<g.w||g.sh<g.h),tooSmall=tooSmallCover||tooSmallContain,transparencyMissing=state.preset.pngOnly&&!state.hasTransparency;
 const centered=Math.abs(g.x+(g.contentBounds.left+g.contentBounds.right)*g.scale/2-g.w/2)<.75&&Math.abs(g.y+(g.contentBounds.top+g.contentBounds.bottom)*g.scale/2-g.h/2)<.75;
 checkClass(ui.resolution,tooSmall?"bad":"ok",tooSmall?"!":"✓");ui.resolutionText.textContent=tooSmall?(tooSmallCover?t("tooSmallCover"):t("tooSmallContain")):t("sourceDimensions",{width:g.sw,height:g.sh});
 checkClass(ui.transparency,transparencyMissing?"bad":state.preset.pngOnly?"ok":"neutral",transparencyMissing?"!":state.preset.pngOnly?"✓":"•");ui.transparencyText.textContent=transparencyMissing?t("transparencyMissing"):state.preset.pngOnly?t("transparencyOk"):t("transparencyOptional");
 checkClass(ui.alignment,centered?"ok":"warn",centered?"✓":"↗");ui.alignmentText.textContent=centered?t("exactlyCentered"):t("imageMoved");
 ui.centerStatus.classList.toggle("off-center",!centered);ui.centerText.textContent=centered?t("centered"):t("moved");
 const limit=state.file.size<=10*1024*1024;checkClass(ui.limit,limit?"ok":"warn",limit?"✓":"!");
 ui.limitText.textContent=limit?t("under10",{size:bytesLabel(state.file.size)}):t("checkExportSize",{size:bytesLabel(state.file.size)});ui.download.disabled=tooSmall||transparencyMissing;
 if(transparencyMissing){ui.message.textContent=t("transparencyMissing");ui.message.className="export-message error";ui.guide.classList.add("error");ui.guideTitle.textContent=t("transparencyMissing")}
 else if(tooSmall){ui.message.textContent=tooSmallCover?t("upscaleBlocked"):t("underfilledSource");ui.message.className="export-message error";ui.guide.classList.add("error");ui.guideTitle.textContent=tooSmallCover?t("tooSmallCover"):t("tooSmallContain")}
 else{ui.message.textContent=state.file.size>10*1024*1024?t("sourceFileBig"):t("readyToExport",{format:ui.format.value.toUpperCase()});ui.message.className=state.file.size>10*1024*1024?"export-message warning":"export-message";updatePresetInfo()}
}
function paint(){
 updatePresetInfo();sizeBoard();ui.board.setAttribute("aria-label",t("boardAria"));
 if(!state.image){ui.image.hidden=true;ui.empty.hidden=false;ui.safe.hidden=state.preset.id!=="clearlogo";ui.stamp.hidden=true;ui.dragHint.hidden=true;ui.zoom.disabled=true;ui.zoom.max="1";ui.zoom.value="1";ui.zoomValue.value="100%";updateChecks();return}
 const g=geometry(),unit=ui.board.clientWidth/g.w;ui.image.hidden=false;ui.empty.hidden=true;ui.safe.hidden=state.preset.id!=="clearlogo";ui.dragHint.hidden=false;
 ui.image.style.width=(g.dw*unit)+"px";ui.image.style.height=(g.dh*unit)+"px";ui.image.style.left=(g.x*unit)+"px";ui.image.style.top=(g.y*unit)+"px";
 const maxZoom=Math.max(1,Math.min(3,1/g.base));ui.zoom.min="1";ui.zoom.max=String(maxZoom);ui.zoom.value=String(Math.min(state.zoom,maxZoom));ui.zoom.disabled=maxZoom<=1.005;ui.zoomValue.value=Math.round(state.zoom*100)+"%";
 stampPreview();updateChecks();
}
function applyLanguage(){
 document.documentElement.lang=state.language;document.title="Onion's Img Editor — TheTVDB artwork";
 const description=$("meta[name='description']");description.content=state.language==="nl"?"Maak TheTVDB-artwork met precieze uitsneden, kwaliteitscontrole en presets. Je afbeeldingen blijven op je apparaat.":"Prepare TheTVDB artwork with precise crops, quality checks and presets. Your images stay on your device.";
 document.querySelectorAll("[data-i18n]").forEach((node)=>{node.innerHTML=t(node.dataset.i18n)});
 document.querySelectorAll("[data-i18n-aria]").forEach((node)=>node.setAttribute("aria-label",t(node.dataset.i18nAria)));
 ui.language.setAttribute("aria-label",t("languageLabel"));ui.remove.setAttribute("aria-label",t("removeImage"));ui.theme.setAttribute("aria-label",t(document.documentElement.dataset.theme==="dark"?"themeLightLabel":"themeDarkLabel"));ui.fileState.textContent=state.image?t("fileStateLoaded"):t("fileStateEmpty");
}
function setTheme(theme,persist=true){
 const dark=theme==="dark";document.documentElement.dataset.theme=dark?"dark":"light";ui.theme.setAttribute("aria-pressed",String(dark));ui.theme.setAttribute("aria-label",t(dark?"themeLightLabel":"themeDarkLabel"));
 const themeColor=$("meta[name='theme-color']");if(themeColor)themeColor.content=dark?"#000000":"#f5f4f1";
 if(persist)localStorage.setItem("onions-img-editor-theme",dark?"dark":"light");
}
function analyzeImage(image){
 const sw=image.naturalWidth,sh=image.naturalHeight,sampleScale=Math.min(1,1024/Math.max(sw,sh)),width=Math.max(1,Math.round(sw*sampleScale)),height=Math.max(1,Math.round(sh*sampleScale));
 const fullBounds={left:0,top:0,right:sw,bottom:sh},canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext("2d",{willReadFrequently:true});if(!ctx)return {hasTransparency:false,bounds:fullBounds};
 try{
  ctx.drawImage(image,0,0,width,height);const data=ctx.getImageData(0,0,width,height).data;let hasTransparency=false,minX=width,minY=height,maxX=-1,maxY=-1;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const alpha=data[(y*width+x)*4+3];if(alpha<250)hasTransparency=true;
   if(alpha>8){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}
  }
  if(maxX<minX||maxY<minY)return {hasTransparency,bounds:fullBounds};
  return {hasTransparency,bounds:{left:minX*sw/width,top:minY*sh/height,right:(maxX+1)*sw/width,bottom:(maxY+1)*sh/height}};
 }catch{return {hasTransparency:false,bounds:fullBounds}}
}
function loadImage(file){
 const allowed=["image/png","image/jpeg","image/webp","image/avif"];
 if(!file||!allowed.includes(file.type)){ui.message.textContent=t("chooseImageError");ui.message.className="export-message error";return}
 if(state.url)URL.revokeObjectURL(state.url);state.file=file;state.url=URL.createObjectURL(file);const image=new Image();
 image.onload=()=>{state.image=image;const analysis=analyzeImage(image);state.hasTransparency=analysis.hasTransparency;state.alphaBounds=analysis.bounds;state.shiftX=0;state.shiftY=0;state.zoom=1;ui.image.src=state.url;ui.image.alt=file.name;ui.fileState.textContent=t("fileStateLoaded");ui.fileName.textContent=file.name;ui.fileSize.textContent=image.naturalWidth+" × "+image.naturalHeight+" px · "+bytesLabel(file.size);ui.fileDetails.hidden=false;ui.drop.hidden=true;paint();if(state.preset.id==="season-poster")autoSeasonStyle()};
 image.onerror=()=>{ui.message.textContent=t("openImageError");ui.message.className="export-message error";URL.revokeObjectURL(state.url);state.url=null};image.src=state.url;
}
function removeImage(){
 if(state.url)URL.revokeObjectURL(state.url);state.url=null;state.image=null;state.file=null;state.hasTransparency=false;state.alphaBounds=null;ui.input.value="";ui.fileDetails.hidden=true;ui.drop.hidden=false;ui.fileState.textContent=t("fileStateEmpty");state.shiftX=0;state.shiftY=0;state.zoom=1;paint();
}
function move(dx,dy){if(!state.image)return;state.shiftX+=dx*state.preset.width*.025;state.shiftY+=dy*state.preset.height*.025;constrainPosition();paint()}
function startDrag(e){if(!state.image)return;state.dragging=true;state.pointerX=e.clientX;state.pointerY=e.clientY;ui.board.classList.add("dragging");ui.board.setPointerCapture(e.pointerId);e.preventDefault()}
function drag(e){if(!state.dragging||!state.image)return;const unit=ui.board.clientWidth/state.preset.width;state.shiftX+=(e.clientX-state.pointerX)/unit;state.shiftY+=(e.clientY-state.pointerY)/unit;state.pointerX=e.clientX;state.pointerY=e.clientY;constrainPosition();paint()}
function setCustom(){
 const w=Math.round(Number(ui.customW.value)),h=Math.round(Number(ui.customH.value));
 if(!Number.isFinite(w)||!Number.isFinite(h)||w<1||h<1||w>12000||h>12000){ui.message.textContent=t("customSizeError");ui.message.className="export-message error";return}
 if(w*h>40000000){ui.message.textContent=t("customTooLarge");ui.message.className="export-message error";return}
 state.preset={id:"custom",width:w,height:h,shape:w>h?"wide":"poster",mode:"cover",icon:"⌗"};state.custom=true;state.shiftX=0;state.shiftY=0;state.zoom=1;ui.seasonPanel.hidden=true;renderPresets();updateFormat();paint();
}
function updateFormat(){
 const jpegOption=ui.format.querySelector('option[value="jpeg"]'),requiresPng=Boolean(state.preset.pngOnly);jpegOption.disabled=requiresPng;if(requiresPng&&ui.format.value==="jpeg")ui.format.value="png";
 const jpeg=ui.format.value==="jpeg";ui.jpegOptions.hidden=!jpeg;ui.formatNote.textContent=requiresPng?t("formatPngRequired"):jpeg?t("formatJpeg"):t("formatPng");
 ui.download.innerHTML=t("download",{format:ui.format.value.toUpperCase()});if(state.image)updateChecks();
}
function drawSeason(ctx,w,h){
 if(state.preset.id!=="season-poster"||!ui.seasonToggle.checked)return;
 const n=Math.max(0,Math.min(99,Number(ui.seasonNumber.value)||0)),text=t("seasonPrefix")+" "+n,size=Math.max(22,Math.round(w*.038));
 const family=ui.stampStyle.value==="serif"?'Georgia, "Times New Roman", serif':ui.stampStyle.value==="condensed"?'"Arial Narrow", "Segoe UI", sans-serif':'Inter, "Segoe UI", Arial, sans-serif';
 ctx.save();ctx.font="700 "+size+"px "+family;ctx.textBaseline="middle";
 const px=Math.round(size*.75),py=Math.round(size*.44),tw=ctx.measureText(text).width,bw=tw+px*2,bh=size+py*2,margin=Math.round(w*.05);let x=margin,y=h-margin-bh,pos=ui.stampPosition.value;
 if(pos.endsWith("center"))x=(w-bw)/2;if(pos.endsWith("right"))x=w-margin-bw;if(pos.startsWith("top"))y=margin;
 const radius=Math.round(size*.28);ctx.fillStyle=hexRgba(ui.stampBackground.value,.9);ctx.beginPath();ctx.roundRect(x,y,bw,bh,radius);ctx.fill();ctx.fillStyle=ui.stampColor.value;ctx.fillText(text,x+px,y+bh/2);ctx.restore();
}
function exportImage(){
 if(!state.image||ui.download.disabled)return;const g=geometry(),canvas=document.createElement("canvas");canvas.width=g.w;canvas.height=g.h;
 const type=ui.format.value==="jpeg"?"image/jpeg":"image/png",ctx=canvas.getContext("2d",{alpha:type==="image/png"});ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
 if(type==="image/jpeg"){ctx.fillStyle=ui.jpegBackground.value;ctx.fillRect(0,0,g.w,g.h)}ctx.drawImage(state.image,g.x,g.y,g.dw,g.dh);drawSeason(ctx,g.w,g.h);ui.message.textContent=t("preparing");ui.message.className="export-message";
 canvas.toBlob((blob)=>{
  if(!blob){ui.message.textContent=t("exportFailed");ui.message.className="export-message error";return}
  const ext=type==="image/jpeg"?"jpg":"png",base=state.file.name.replace(/\.[^.]+$/,"").replace(/[^a-z0-9_-]+/gi,"-")||"onion-artwork";
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=base+"-"+g.w+"x"+g.h+"."+ext;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);const big=blob.size>10*1024*1024;
  ui.message.textContent=big?t("downloadedTooBig",{size:bytesLabel(blob.size)}):t("downloaded",{size:bytesLabel(blob.size),width:g.w,height:g.h});ui.message.className=big?"export-message warning":"export-message";
 },type,type==="image/jpeg"?Number(ui.jpegQuality.value):undefined);
}

ui.input.addEventListener("change",(e)=>loadImage(e.target.files&&e.target.files[0]));ui.remove.addEventListener("click",removeImage);
ui.more.addEventListener("click",()=>{ui.extra.hidden=!ui.extra.hidden;renderPresets()});ui.applyCustom.addEventListener("click",setCustom);
ui.center.addEventListener("click",()=>{state.shiftX=0;state.shiftY=0;paint()});ui.autoStyle.addEventListener("click",autoSeasonStyle);
ui.zoom.addEventListener("input",()=>{state.zoom=Number(ui.zoom.value);constrainPosition();paint()});
ui.board.addEventListener("pointerdown",startDrag);ui.board.addEventListener("pointermove",drag);ui.board.addEventListener("pointerup",()=>{state.dragging=false;ui.board.classList.remove("dragging")});ui.board.addEventListener("pointercancel",()=>{state.dragging=false;ui.board.classList.remove("dragging")});
ui.board.addEventListener("keydown",(e)=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(!d[e.key])return;e.preventDefault();move(d[e.key][0],d[e.key][1])});
document.querySelectorAll(".nudge-controls button").forEach((b)=>b.addEventListener("click",()=>move(Number(b.dataset.dx),Number(b.dataset.dy))));
ui.seasonToggle.addEventListener("change",stampPreview);ui.seasonNumber.addEventListener("input",stampPreview);ui.stampPosition.addEventListener("change",stampPreview);ui.stampColor.addEventListener("input",stampPreview);ui.stampBackground.addEventListener("input",stampPreview);ui.stampStyle.addEventListener("change",stampPreview);
ui.format.addEventListener("change",updateFormat);ui.jpegQuality.addEventListener("input",()=>{ui.jpegQualityValue.value=Math.round(Number(ui.jpegQuality.value)*100)+"%"});ui.download.addEventListener("click",exportImage);
ui.theme.addEventListener("click",()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
ui.language.addEventListener("change",()=>{state.language=ui.language.value==="nl"?"nl":"en";localStorage.setItem("onions-img-editor-language",state.language);applyLanguage();renderPresets();updateFormat();paint();if(state.preset.id==="season-poster")autoSeasonStyle()});
ui.drop.addEventListener("dragover",(e)=>{e.preventDefault();ui.drop.classList.add("drag-active")});ui.drop.addEventListener("dragleave",()=>ui.drop.classList.remove("drag-active"));ui.drop.addEventListener("drop",(e)=>{e.preventDefault();ui.drop.classList.remove("drag-active");loadImage(e.dataTransfer.files&&e.dataTransfer.files[0])});
document.addEventListener("dragover",(e)=>e.preventDefault());document.addEventListener("drop",(e)=>{if(!ui.drop.contains(e.target))e.preventDefault()});

const savedLanguage=localStorage.getItem("onions-img-editor-language");state.language=savedLanguage==="nl"?"nl":"en";ui.language.value=state.language;
const savedTheme=localStorage.getItem("onions-img-editor-theme");setTheme(savedTheme==="dark"?"dark":"light",false);
applyLanguage();renderPresets();updateFormat();paint();window.addEventListener("resize",paint);
