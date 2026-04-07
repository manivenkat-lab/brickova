$path = "components/PropertyForm.tsx"
$content = Get-Content $path
$newContent = @()

$insertionDone = $false
foreach ($line in $content) {
    if (!$insertionDone -and $line -like "*<div className=`"flex gap-3 md:gap-4 pt-4`">*") {
        $newContent += "                  <BlueprintUpload "
        $newContent += "                    blueprintFile={blueprintFile} "
        $newContent += "                    floorPlanUrl={formData.floorPlanUrl} "
        $newContent += "                    onFileSelect={(file) => setBlueprintFile(file)} "
        $newContent += "                    onRemove={() => { setBlueprintFile(null); setFormData(f => ({ ...f, floorPlanUrl: '' })); }} "
        $newContent += "                  />"
        $newContent += ""
        $insertionDone = $true
    }
    $newContent += $line
}

$newContent | Set-Content $path
Write-Host "Successfully modified PropertyForm.tsx"
