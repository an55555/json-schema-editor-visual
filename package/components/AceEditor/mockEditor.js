const ace = require('brace');
require('brace/mode/json');


function run(options) {
  let editor,
    mockEditor,
    rhymeCompleter;
  function handleJson(json) {
    const curData = mockEditor.curData;
    try {
      curData.text = json;
      const obj = JSON.parse(json);
      curData.format = true;
      curData.jsonData = obj;
    } catch (e) {
      curData.format = e.message;
    }
  }
  options = options || {};
  let container,
    data;
  container = options.container || 'mock-editor';
  if (options.wordList && typeof options.wordList === 'object' && options.wordList.name && options.wordList.mock) {
    wordList.push(options.wordList);
  }
  data = options.data || '';
  options.readOnly = options.readOnly || false;
  options.fullScreen = options.fullScreen || false;

  editor = ace.edit(container);
  editor.$blockScrolling = Infinity;
  editor.getSession().setMode('ace/mode/json');
  if (options.readOnly === true) {
    editor.setReadOnly(true);
    editor.renderer.$cursorLayer.element.style.display = 'none';
  }
  editor.setOptions({
    useWorker: true,
  });
  editor._fullscreen_yapi = options.fullScreen;
  mockEditor = {
    curData: {},
    getValue: () => mockEditor.curData.text,
    setValue(data) {
      editor.setValue(handleData(data));
    },
    editor,
    options,
    insertCode: (code) => {
      const pos = editor.selection.getCursor();
      editor.session.insert(pos, code);
    },
  };

  function formatJson(json) {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (err) {
      return json;
    }
  }

  function handleData(data) {
    data = data || '';
    if (typeof data === 'string') {
      return formatJson(data);
    } else if (typeof data === 'object') {
      return JSON.stringify(data, null, '  ');
    }
  }

  mockEditor.setValue(handleData(data));
  handleJson(editor.getValue());

  editor.clearSelection();

  editor.getSession().on('change', () => {
    handleJson(editor.getValue());
    if (typeof options.onChange === 'function') {
      options.onChange.call(mockEditor, mockEditor.curData);
    }
    editor.clearSelection();
  });

  return mockEditor;
}

module.exports = run;
