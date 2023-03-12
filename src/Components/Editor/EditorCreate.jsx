/* eslint-disable react/no-multi-comp */
import React, { Component } from "react";

import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";

import createToolbarPlugin, { Separator } from "@draft-js-plugins/static-toolbar";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
} from "@draft-js-plugins/buttons";
import editorStyles from "./editorStyles.module.css";

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

export default class CustomToolbarEditor extends Component {
  state = {
    editorState: createEditorStateWithText(this.props.text),
  };

  onChange = (editorState) => {
    console.log(editorState.getCurrentContent());
    this.props.handleDescription(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    this.setState({
      editorState,
    });
  };

  componentDidMount() {
    // fixing issue with SSR https://github.com/facebook/draft-js/issues/2332#issuecomment-761573306
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      editorState: createEditorStateWithText(this.props.text),
    });
  }

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div>
        <Toolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <div
                style={{
                  display: "flex",
                  borderLeft: "1px #038fdd solid",
                  height: 28,
                  marginBottom: 8,
                  marginTop: 24,
                }}
              >
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <Separator {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <HeadlineThreeButton {...externalProps} />
              </div>
            )
          }
        </Toolbar>
        <div id="editor" className={editorStyles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
        </div>
      </div>
    );
  }
}
