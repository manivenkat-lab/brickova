const fs = require('fs');
const path = 'components/PropertyForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// Insert the BlueprintUpload component call before the buttons in the STRUCTURAL tab
const searchPoint = 'setActiveTab(\'REVIEW\')';
if (content.includes(searchPoint)) {
    const lines = content.split('\n');
    let targetLineIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(searchPoint)) {
            targetLineIdx = i;
            break;
        }
    }
    
    if (targetLineIdx !== -1) {
        // Find the start of the button row
        let buttonRowIdx = targetLineIdx;
        while (buttonRowIdx > 0 && !lines[buttonRowIdx].includes('flex gap-3')) {
            buttonRowIdx--;
        }
        
        if (buttonRowIdx !== -1) {
            const blueprintCall = `                  <BlueprintUpload 
                    blueprintFile={blueprintFile} 
                    floorPlanUrl={formData.floorPlanUrl} 
                    onFileSelect={(file) => setBlueprintFile(file)} 
                    onRemove={() => { setBlueprintFile(null); setFormData(f => ({ ...f, floorPlanUrl: '' })); }} 
                  />\n`;
            lines.splice(buttonRowIdx, 0, blueprintCall);
            content = lines.join('\n');
            fs.writeFileSync(path, content);
            console.log("Successfully inserted BlueprintUpload component.");
        } else {
            console.error("Could not find button row start.");
        }
    } else {
        console.error("Could not find search point.");
    }
} else {
    console.error("Search point not found in content.");
}
