/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as Viewer from "tui-editor/dist/tui-editor-Viewer";
import * as remark from "remark";

class ComponentCtrl implements ng.IComponentController {

  public page: any;
  public options: any;

  constructor(private $rootScope) {
      "ngInject";
  }

  $onInit() {}

  $onChanges() {
    const initialValue = this.page && this.page.content ? this.page.content : "";

    let ast = remark.parse(initialValue);

    let content = "";
    let sectionOpen = false;
    this.three_columns = true;


    var sectionValue = "";
    for (let c = 0; c < ast.children.length; c++) {
      const child = ast.children[c];

      if (child.type !== 'heading' || child.depth < 2 || child.depth > 2) {
        continue;
      }

      if (sectionOpen) {
        sectionValue += "</section>";
      }

      let id = child.children[0].value.replace(new RegExp(' ', 'g'), '').toLowerCase();
      sectionValue += "<section id='" + id + "'>";
      sectionOpen = true;

      ast.children.splice(c, 0, {
        type: 'html',
        value: sectionValue
      });
      c++;
      sectionValue = "";
    }

    if (sectionOpen) {
      ast.children.splice(ast.children.length - 1, 0, {
        type: 'html',
        value: sectionValue
      });
    }
    //ast.children.forEach(element => {
      /*if (element.type === 'heading' && element.depth === 1) {

        if (sectionOpen) {
          content += "</section>";
        }
        content += "<section>";
        sectionOpen = true;
        //.replace(new RegExp(' ', 'g'), '').toLowerCase()
      }*/
    /*  content += remark.stringify(element);
      content += '\n';
    });*/

    //debugger;
    /*if (sectionOpen) {
      content += "</section>";
    }*/

    //console.log(content);
    content = remark.stringify(ast);

    new Viewer(Object.assign({
      el: document.querySelector("#viewerSection"),
      viewer: true,
      height: "auto",
      initialValue: content,
      useDefaultHTMLSanitizer: false
    }, this.options));
  }
}

const PageEditorMarkdownViewerComponent: ng.IComponentOptions = {
  template: require("./page-editormarkdown-viewer.html"),
  bindings: {
    page: "<",
    options: "<"
  },
  controller: ComponentCtrl
};

export default PageEditorMarkdownViewerComponent;
