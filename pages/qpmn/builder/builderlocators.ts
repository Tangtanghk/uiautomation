export const locators = {
    //locators before open builder
    orderasample: "Order a sample",
    iframe: `iframe[name="builderFrame"]`,
    
    //dialog after click order a sample
    promtconfirm: "#qp-prompt-confirm-button",
    
    //progress box when uploading image
    progressbox: `//div[@class="upload-pictures-box"]//div [@class='progress-box']`,
    progressboxhide: `//div [@class='progress-box ng-hide']`,
    adddesignelement: "Add design element",

    //imgage design
    imagedropdown: `//Button[@class='img-more-btn-container dropdown-toggle']`,

    //builder assistant
    assistantundo: `//button[@title="Undo"]`,
    assistantredo: `//button[@title="Redo"]`,
    assistantzoomin: `//button[@title="ZoomIn"]`,
    assistantzoomout: `//button[@title="ZoomOut"]`,
    assistantoriginal: `//button[@title="Original"]`,
    assistantfit: `//button[@title="Fit"]`,
    assistantpreview: `//button[@title="Preview"]`,
    assistantduplicate: `//button[@title="Duplicate"]`,
    assistantremove: `//button[@title="Remove"]`,
    assistantbackgroundeditor: `//button[@title="BackgroundEditor"]`,
    assistantforegroundeditor: `//button[@title="ForegroundEditor"]`,
    assistantproperty: `//button[@title="Property"]`,

    //builder assistant ground editor
    groundeditorcrop: `//button[@ng-click="ctrl.changeFillMode('Crop')"]`,
    groundeditorcontain: `//button[@ng-click="ctrl.changeFillMode('Contain')"]`,
    groundeditorfill: `//button[@ng-click="ctrl.changeFillMode('Fill')"]`,
    groundeditorrotateplus: `//button[@class="btn btn-default" and @ng-click="ctrl.rotate(15)"]`,
    groundeditorrotateminus: `//button[@class="btn btn-default" and @ng-click="ctrl.rotate(-15)"]`,
    groundeditorrotatebutton1:`//button[@class="rotate-btn-container" and @ng-click="ctrl.rotate(-15)"]`,
    groundeditorrotatebutton2: `//button[@class="rotate-btn-container" and @ng-click="ctrl.rotate(15)"]`,
    groundeditorrotatebutton3: `//button[@class="rotate-btn-container" and @ng-click="ctrl.rotate(-90)"]`,
    groundeditorrotatebutton4: `//button[@class="rotate-btn-container" and @ng-click="ctrl.rotate(90)"]`,
    groundeditorflipx: `//button[@class="y-axis-container" and @ng-click="ctrl.flipXAxis()"]`,
    groundeditorflipy: `//button[@class="x-axis-container" and @ng-click="ctrl.flipYAxis()"]`,
    groundeditorzoomwplus:`//button[@ng-click="ctrl.setWidth(1)"]`,
    groundeditorzoomwminus:`//button[@ng-click="ctrl.setWidth(-1)"]`,
    groundeditorzoomhplus:`//button[@ng-click="ctrl.setHeight(1)"]`,
    groundeditorzoomhminus:`//button[@ng-click="ctrl.setHeight(-1)"]`,
    groundeditorlockratio: `//input[@id="lock-aspect-ratio-checkbox" and contains(@class, "ng-empty")]`,

    //mobile locators
    //progress box when uploading image
    mobileprogressbox: `//div[@class="upload-pictures-box"]//div [@class='progress-box']`,
}