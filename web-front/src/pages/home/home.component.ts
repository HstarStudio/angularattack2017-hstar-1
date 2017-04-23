require('./home.styl');
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UtilService, TemplateService } from './../../services';
import { WdAjax, WdEventBus } from './../../shared';

const extTypeMapping = {
  '.js': 'javascript',
  '.css': 'css',
  '.html': 'html'
};

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  private dragEvents: Array<any> = [];
  private subs: Subscription[] = [];
  private previewContainer: any = null;
  private leftSidebarWidth: number = 0;
  private projectInfo: any = {
    projectName: '',
    projectDescription: '',
    projectTags: [],
    files: {}
  };
  private wantToTemplate: any = {};

  public currentTemplate: any = {};
  public isLeftSidebarMini: boolean = false;
  public editorHeight: number = 100;
  public previewLoading: boolean = false;
  public showTemplateChangeDialog = false;
  public showSaveDialog = false;
  public templates = [
    { key: 'normal', text: 'Normal' },
    { key: 'jquery', text: 'jQuery' },
    { key: 'angularjs', text: 'AngularJS' },
    { key: 'vue1', text: 'Vue1' },
    { key: 'vue2', text: 'Vue2' }
  ];
  public tagItems: Array<string> = ['AngularJS', 'Vue1', 'Vue2', 'jQuery', 'CSS', 'HTML5', 'Animation', 'Canvas'];

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private ajax: WdAjax,
    private eventBus: WdEventBus,
    private util: UtilService,
    private template: TemplateService
  ) { }

  ngOnInit() {
    this.previewContainer = this.util.$('.preview-container', this.elementRef.nativeElement);
    this._initDragEvents();
    this._initSubscriptions();
    this._setEditorHeight();
    this._initProject();
    this.eventBus.on('project_save_click', () => {
      this._saveProject();
    }, this);
  }

  ngOnDestroy() {
    this.dragEvents.forEach(item => item.destroy());
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  public menuMiniBtnClick() {
    let leftSidebar = this.util.$('.left-sidebar', this.elementRef.nativeElement);
    let rightViewport = this.util.$('.right-viewport', this.elementRef.nativeElement);
    if (this.isLeftSidebarMini) { // Need expand
      leftSidebar.style.width = `${this.leftSidebarWidth}px`;
      rightViewport.style.left = `${this.leftSidebarWidth}px`;
      this.isLeftSidebarMini = false;
    } else { // Need collspse
      this.leftSidebarWidth = parseInt(this.util.getComputedStyle(leftSidebar, 'width'), 10);
      leftSidebar.style.width = '0px';
      rightViewport.style.left = '0px';
      this.isLeftSidebarMini = true;
    }
  }

  public changeTemplate(template: any) {
    this.showTemplateChangeDialog = true;
    this.wantToTemplate = template;
  }

  public closeTemplateChangeDialog(op?: string) {
    this.showTemplateChangeDialog = false;
    if (op === 'onlyTemplate') {
      this.currentTemplate = this.template.getTemplate(this.wantToTemplate.key);
      this.runCode();
    } else if (op === 'all') {
      this.currentTemplate = this.template.getTemplate(this.wantToTemplate.key);
      this._setProjectFilesByTemplate(this.currentTemplate);
      this.runCode();
    }
  }

  public runCode() {
    this.previewLoading = true;
    let startLoadingTime = Date.now();
    let iframeHtml = `<iframe id="previewFrame" frameborder="0" style="width: 100%;height: 100%;" border="0" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>`;
    this.previewContainer.innerHTML = iframeHtml;
    let iframe = document.getElementById('previewFrame') as any;
    let fd = iframe.contentDocument;
    Observable.fromEvent(iframe, 'load')
      .subscribe(evt => {
        let timespan = Date.now() - startLoadingTime;
        setTimeout(() => {
          this.previewLoading = false;
        }, timespan > 1000 ? 0 : 1000 - timespan);
      });
    fd.open();
    fd.write('');
    fd.write(this._buildHtmlCodeForPreview());
    fd.close();
  }

  public doSaveProject() {
    if (!this.projectInfo.projectName || this.projectInfo.projectTags.length === 0) {
      return;
    }
    this.ajax.post(`${AppConf.apiHost}/project`, Object.assign(this.projectInfo, { templateName: this.currentTemplate.name }))
      .then(({ data }) => {
        this.showSaveDialog = false;
        this.router.navigate([`${data.username}/${data.projectId}`]);
      });
  }

  private _setProjectFilesByTemplate(template: any) {
    this.projectInfo.files['index.html'] = template.html;
    this.projectInfo.files['index.js'] = template.js;
    this.projectInfo.files['index.css'] = template.css;
  }

  private _initProject() {
    this.route.params.subscribe(params => {
      if (!params.user) {
        this.currentTemplate = this.template.getTemplate('normal');
        this._setProjectFilesByTemplate(this.currentTemplate);
        this.runCode();
      } else {
        this.ajax.get(`${AppConf.apiHost}/project/${params.user}/${params.project}`)
          .then(({ data }) => {
            this.currentTemplate = this.template.getTemplate(data.templateName);
            this.projectInfo = data;
            this.runCode();
          });
      }
    })
  }

  private _initSubscriptions() {
    let sub = Observable.fromEvent(window, 'resize')
      .throttleTime(100)
      .subscribe(evt => {
        this._setEditorHeight();
      });
    this.subs.push(sub);
    sub = Observable.fromEvent(document, 'keydown')
      .subscribe((evt: KeyboardEvent) => {
        if (evt.ctrlKey && evt.code === 'KeyS') {
          evt.preventDefault();
          this._saveProject();
        }
      });
    this.subs.push(sub);
  }

  private _saveProject() {
    if (this.projectInfo.projectId) {
      return this._updateProjectContent();
    }
    this.showSaveDialog = true;
  }

  private _updateProjectContent() {
    this.ajax.put(`${AppConf.apiHost}/project/${this.projectInfo.projectId}/files`, {
      files: this.projectInfo.files,
      templateName: this.currentTemplate.name
    })
      .then(() => {
        this.runCode();
      });
  }

  private _setEditorHeight() {
    let height = this.util.getComputedStyle(document.querySelector('.note-list') as HTMLElement, 'height');
    this.editorHeight = parseInt(height, 10) - 42;
  }

  private _buildHtmlCodeForPreview() {
    let html = this.projectInfo.files['index.html'] || '';
    let js = this.projectInfo.files['index.js'] || '';
    let css = this.projectInfo.files['index.css'] || '';

    let iframeContent = this.currentTemplate.template
      .replace('<!--body-->', html)
      .replace('<!--js-->', `<script>${js}</script>`)
      .replace('<!--css-->', `<style>${css}</style>`);
    return iframeContent;
  }

  private _initDragEvents() {
    let self = this;
    let leftSidebar = this.elementRef.nativeElement.querySelector('.left-sidebar');
    let rightViewport = this.elementRef.nativeElement.querySelector('.right-viewport');
    let drag = leftSidebar.querySelector('.drag-line');

    // 左侧面板拖拽
    let dragEvent = this.util.initDrag(drag, (dragObj: any, e: MouseEvent) => {
      let moveX = e.pageX - dragObj.pageX;
      let width = dragObj.initialLeft + moveX;
      width = Math.max(160, Math.min(240, width)); // 小于等于720，大于等于200
      leftSidebar.style.width = `${width}px`;
      rightViewport.style.left = `${width}px`;
    }, {
        processDragObj(dragObj: any) {
          dragObj.initialLeft = parseInt(leftSidebar.style.width || '200', 10);
        }
      }
    );
    this.dragEvents.push(dragEvent);

    let drag2 = rightViewport.querySelector('.note-list .drag-line');
    let noteList = rightViewport.querySelector('.note-list');
    let noteView = rightViewport.querySelector('.preview');
    // 中间面板拖拽
    dragEvent = this.util.initDrag(drag2, (dragObj: any, e: MouseEvent) => {
      let moveX = e.pageX - dragObj.pageX;
      let width = dragObj.initialLeft + moveX;
      let maxValue = window.innerWidth - parseInt(this.util.getComputedStyle(leftSidebar, 'width'), 10) - 320;
      width = Math.max(280, Math.min(maxValue, width)); // 小于等于720，大于等于280
      noteList.style.width = `${width}px`;
      noteView.style.left = `${width}px`;
    }, {
        processDragObj(dragObj: any) {
          let clientWidth = parseInt(self.util.getComputedStyle(noteList, 'width'), 10);
          dragObj.initialLeft = parseInt(noteList.style.width || clientWidth.toString(), 10);
        }
      }
    );
    this.dragEvents.push(dragEvent);
  }
}
