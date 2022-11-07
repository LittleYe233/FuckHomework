/** @type {import('./src/lib/types/config').RawProjectConfig} */
export default {
  version: 1,
  vite: {
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false
    }
  },
  homework: {
    savePath: './data/homework',
    subFolderFormat: '${homeworkTitle}',
    entries: [
      {
        title: 'Homework 1',
        content: 'Content 1',
        semester: '2022 Fall',
        subject: 'Subject A',
        chapter: 'Chapter I, Section 1.1',
        dueTime: '2022-07-12T10:50:28+08:00',
        submissionMethod: 'Uploading files',
        rules: [
          {
            type: 'filename_check',
            priority: 'whitelist',
            whitelist: ['${homeworkTitle}-testname.txt', 'test-testname.txt'],
            blacklist: []
          }
        ]
      },
      {
        title: 'Homework 2',
        dueTime: '1145-01-04T11:45:14+08:00'
      }
    ]
  }
};
