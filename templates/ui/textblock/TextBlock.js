import BaseSizer from '../basesizer/BaseSizer.js';
import SetTextObject from './SetTextObject.js';
import SetText from './SetText.js';
import UpdateTextObject from './UpdateTextObject.js';
import Layout from './Layout.js';
import LinesCountToTextHeight from './LinesCountToTextHeight.js';
import TextHeightToLinesCount from './TextHeightToLinesCount.js';

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const GetValue = Phaser.Utils.Objects.GetValue;
const Clamp = Phaser.Math.Clamp;

class TextBlock extends BaseSizer {
    constructor(scene, x, y, minWidth, minHeight, config) {
        if (IsPlainObject(x)) {
            config = x;
            x = GetValue(config, 'x', 0);
            y = GetValue(config, 'y', 0);
            minWidth = GetValue(config, 'width', undefined);
            minHeight = GetValue(config, 'height', undefined);
        } else if (IsPlainObject(minWidth)) {
            config = minWidth;
            minWidth = GetValue(config, 'width', undefined);
            minHeight = GetValue(config, 'height', undefined);
        }

        super(scene, x, y, minWidth, minHeight, config);

        this.type = 'rexTextBlock';
        this.textObject = undefined;
        this.textMask = undefined;
        this.textObjectType = undefined;
        this.lines = undefined; // array (default text object), or pens-manager (tag text object)
        this.text = '';
        this._textOY = 0;
        this.execeedTopState = false;
        this.execeedBottomState = false;

        // Add elements
        var background = GetValue(config, 'background', undefined);
        var textObject = GetValue(config, 'text', undefined);
        if (textObject === undefined) {
            textObject = createDefaultTextObject(scene);
        }
        var textMaskEnable = GetValue(config, 'textMask', true);

        // Space
        var paddingConfig = GetValue(config, 'space', undefined);

        if (background) {
            this.addBackground(background);
        }

        this.setTextObject(textObject, paddingConfig, textMaskEnable);

        this.setClampMode(GetValue(config, 'clamplTextOY', true));
    }

    destroy(fromScene) {
        //  This Game Object has already been destroyed
        if (!this.scene) {
            return;
        }
        this.textObject = undefined;
        this.textMask = undefined;
        if (this.lines === undefined) {
            // Do nothing
        } else if (this.textObjectType === 0) {
            this.lines.length = 0;
        } else {
            this.lines.destroy();
        }
        super.destroy(fromScene);
    }

    setClampMode(mode) {
        this.clampTextOYMode = mode;
        return this;
    }

    get textLineHeight() {
        var style = this.textObject.style;
        return style.metrics.fontSize + style.strokeThickness;
    }

    get textLineSpacing() {
        return this.textObject.lineSpacing;
    }

    get totalLinesCount() {
        var count;
        if (this.lines === undefined) {
            count = 0;
        } else if (this.textObjectType === 0) {
            count = this.lines.length;
        } else {
            count = this.lines.linesCount;
        }
        return count;
    }

    get visibleLinesCount() {
        return Math.floor(TextHeightToLinesCount.call(this, this.textObject.height));
    }

    get topTextOY() {
        return 0;
    }

    get bottomTextOY() {
        return -this.textVisibleHeight;
    }

    get textHeight() {
        return LinesCountToTextHeight.call(this, this.totalLinesCount);
    }

    get textObjectHeight() {
        return this.textObject.height;
    }

    get textVisibleHeight() {
        var h;
        var textHeight = this.textHeight;
        var textObjectHeight = this.textObjectHeight;
        if (textHeight > textObjectHeight) {
            h = textHeight - textObjectHeight;
        } else {
            h = 0;
        }

        return h;
    }

    get textOY() {
        return this._textOY;
    }

    set textOY(oy) {
        var topTextOY = this.topTextOY;
        var bottomTextOY = this.bottomTextOY;
        var textOYExceedTop = this.textOYExceedTop(oy);
        var textOYExeceedBottom = this.textOYExeceedBottom(oy);

        if (this.clampTextOYMode) {
            if (this.visibleLinesCount > this.totalLinesCount) {
                oy = 0;
            } else if (textOYExceedTop) {
                oy = topTextOY
            } else if (textOYExeceedBottom) {
                oy = bottomTextOY;
            }
        }

        if (this._textOY !== oy) {
            this._textOY = oy;
            this.updateTextObject();
        }

        if (textOYExceedTop) {
            if (!this.execeedTopState) {
                this.emit('execeedtop', this, oy, topTextOY);
            }
        }
        this.execeedTopState = textOYExceedTop;

        if (textOYExeceedBottom) {
            if (!this.execeedBottomState) {
                this.emit('execeedbottom', this, oy, bottomTextOY);
            }
        }
        this.execeedBottomState = textOYExeceedBottom;
    }

    setTextOY(oy) {
        this.textOY = oy;
        return this;
    }

    setTextOYByPercentage(percentage) {
        percentage = Clamp(percentage, 0, 1);
        this.setTextOY(-this.textVisibleHeight * percentage);
        return this;
    }

    getTextOYPercentage() {
        return (this.textOY / -this.textVisibleHeight);
    }

    textOYExceedTop(oy) {
        if (oy === undefined) {
            oy = this.textOY;
        }
        return (oy > this.topTextOY);
    }

    textOYExeceedBottom(oy) {
        if (oy === undefined) {
            oy = this.textOY;
        }
        return (oy < this.bottomTextOY);
    }
}

var createDefaultTextObject = function (scene) {
    return scene.add.text(0, 0, '');
};

var methods = {
    setTextObject: SetTextObject,
    setText: SetText,
    updateTextObject: UpdateTextObject,
    layout: Layout,
}
Object.assign(
    TextBlock.prototype,
    methods
);

export default TextBlock;