require('./ace-editor.styl');
import { Component, OnInit, Input, ElementRef, forwardRef, OnChanges, SimpleChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ace-editor',
  templateUrl: 'ace-editor.component.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AceEditorComponent), multi: true }
  ]
})

export class AceEditorComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {

  public editorId: string = `ace-editor-${Math.random().toString(16).replace('.', '')}`;
  private editor: any = null;
  private editorValueCache: string = '';
  private onChange: Function;
  private onTouch: Function;
  private value: string = '';

  @Input()
  public mode: string = 'javascript';

  @Input()
  public theme: string = 'monokai';

  @Input()
  public height: number = 100;

  @Input()
  public readonly: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelector('pre').setAttribute('id', this.editorId);
    this._initAceEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this.editor && this.editor.getSession().setMode(`ace/mode/${this.mode}`);
    }
    if (changes.theme) {
      this.editor && this.editor.setTheme(`ace/theme/${this.theme}`);
    }
    if (changes.readonly) {
      this.editor && this.editor.setReadOnly(this.readonly);
    }
  }

  ngOnDestroy() {
    this.editor.container.remove();
    this.editor.destroy();
  }

  _initAceEditor() {
    let ace = window['ace'];
    let editor = this.editor = ace.edit(this.editorId);
    editor.$blockScrolling = Infinity;
    editor.session.setMode(`ace/mode/${this.mode}`);
    editor.setTheme(`ace/theme/${this.theme}`);
    editor.setFontSize(14);
    editor.setOption('enableBasicAutocompletion', true);
    editor.setOption('enableEmmet', true);
    editor.setOption('enableLiveAutocompletion', false);
    editor.setOption('tabSize', 2);
    editor.setOption('enableSnippets', true);
    editor.setOption('showPrintMargin', false);
    editor.setReadOnly(this.readonly);
    editor.setValue(this.value || '', 1);
    let self = this;
    editor.commands.addCommand({
      name: 'format',
      bindKey: { win: 'Shift-Alt-F', mac: 'Command-Option-F' },
      exec(editor: any) {
        let val = self._unpacker_filter(editor.getValue());
        let formattedVal = self._beautifyCode(val);
        editor.setValue(formattedVal, 1);
      }
    });
    editor.on('change', function () {
      let val = self.editor.getValue();
      self.onChange(val);
      self.editorValueCache = val;
    });
  }

  private _unpacker_filter(source: any) {
    let self = this;
    var trailing_comments = '',
      comment = '',
      unpacked = '',
      found = false;
    // cut trailing comments
    do {
      found = false;
      if (/^\s*\/\*/.test(source)) {
        found = true;
        comment = source.substr(0, source.indexOf('*/') + 2);
        source = source.substr(comment.length).replace(/^\s+/, '');
        trailing_comments += comment + "\n";
      } else if (/^\s*\/\//.test(source)) {
        found = true;
        comment = source.match(/^\s*\/\/.*/)[0];
        source = source.substr(comment.length).replace(/^\s+/, '');
        trailing_comments += comment + "\n";
      }
    } while (found);
    const P_A_C_K_E_R = window['P_A_C_K_E_R'], Urlencoded = window['Urlencoded'], JavascriptObfuscator = window['JavascriptObfuscator'], MyObfuscate = window['MyObfuscate'];
    var unpackers = [P_A_C_K_E_R, Urlencoded, JavascriptObfuscator, MyObfuscate];
    for (var i = 0; i < unpackers.length; i++) {
      if (unpackers[i].detect(source)) {
        unpacked = unpackers[i].unpack(source);
        if (unpacked != source) {
          source = self._unpacker_filter(unpacked);
        }
      }
    }
    return trailing_comments + source;
  }

  /**
   * Beautify some code.
   * @param val [string] The code that need beautify.
   */
  private _beautifyCode(val: string) {
    let win = (window as any);
    let opt = {
      brace_style: 'collapse',
      break_chained_methods: false,
      comma_first: false,
      e4x: false,
      end_with_newline: true,
      indent_char: ' ',
      indent_inner_html: false,
      indent_scripts: 'normal',
      indent_size: '2',
      jslint_happy: false,
      keep_array_indentation: false,
      max_preserve_newlines: '5',
      preserve_newlines: true,
      space_before_conditional: true,
      unescape_strings: false,
      wrap_line_length: '0'
    };
    if (this.mode === 'javascript') {
      return win.js_beautify(val, opt);
    } else if (this.mode === 'html') {
      return win.html_beautify(val, opt);
    } else if (this.mode === 'css') {
      return win.css_beautify(val, opt);
    }
    return val;
  }

  writeValue(obj: any): void {
    this.value = obj;
    if (this.value !== this.editorValueCache) {
      if (!this.editor) { return; }
      this.editor.setValue(this.value || '', 1);
      this.editorValueCache = this.value;
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
