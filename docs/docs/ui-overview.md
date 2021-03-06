## List of ui plugins

### UI components

1. [Buttons](ui-buttons.md): A container with a group of buttons.
1. [Dialog](ui-dialog.md): A container with a title, content, buttons and background.
1. [Fix-width-sizer](ui-fixwidthsizer.md): Layout children game objects into lines.
1. [Grid-sizer](ui-gridsizer.md): Layout children game objects in grids.
1. [Grid-table](ui-gridtable.md): A container with a [grid table](gridtable.md), slider, and scroller.
1. [Label](ui-label.md): A container with an icon, text, and background.
1. [Menu](ui-menu.md): A container with buttons and sub-menu.
1. [Number-bar](ui-numberbar.md): A container with an icon, slider, text, and background.
1. [Pages](ui-pages.md): A container with pages, only current page is visible.
1. [Sizer](ui-sizer.md): Layout children game objects.
1. [Slider](ui-slider.md): A container with a track, indicator, thumb and background.
1. [Tabs](ui-tabs.md): A container with 4 groups of buttons around a center panel.
1. [TextArea](ui-textarea.md): A container with a text, slider, and scroller.
1. [Textbox](ui-textbox.md): A container with an icon, ([typing](texttyping.md) and [paging](textpage.md)) text, and background.


### Shape objects

1. [Round-rectangle](shape-roundrectangle.md): Round rectangle shape.
    ```javascript
    var shape = scene.rexUI.add.roundRectangle(x, y, width, height, radius, fillColor);
    ```

### Colored text objects

1. [BBCode text](bbcodetext.md): Drawing text with [BBCode](https://en.wikipedia.org/wiki/BBCode) protocol.
    ```javascript
    var txt = scene.rexUI.add.BBCodeText(x, y, text, style);
    ```
1. [Tag text](tagtext.md): Displays text with multi-color, font face, or font size with tags.
    ```javascript
    var txt = scene.rexUI.add.tagText(x, y, text, style);
    ```