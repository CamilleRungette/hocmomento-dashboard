import React, { useEffect, useRef, useState } from "react";

import { convertToRaw, ContentState, convertFromHTML, EditorState } from "draft-js";
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

const SimpleEditor = ({ text, handleDescription }) => {
  const editorRef = useRef();

  const [editorState, setEditorState] = useState(createEditorStateWithText(""));

  const onChange = (content) => {
    setEditorState(content);
    handleDescription(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  useEffect(() => {
    const blocksFromHtml = convertFromHTML(text);
    const state = ContentState.createFromBlockArray(
      blocksFromHtml.contentBlocks,
      blocksFromHtml.entityMap
    );
    setEditorState(EditorState.createWithContent(state));
  }, [text]);

  const focus = () => {
    editorRef.current.focus();
  };

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
      <div id="editor" className={editorStyles.editor} onClick={focus}>
        <Editor editorState={editorState} onChange={onChange} plugins={plugins} ref={editorRef} />
      </div>
    </div>
  );
};

export default SimpleEditor;
