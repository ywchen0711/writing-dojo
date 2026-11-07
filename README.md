# 寫作練功房 Writing Dojo

**Play:** https://ywchen0711.github.io/writing-dojo/

English writing practice for kids in grades 1–12, following the US Common Core Writing and Language standards
(plus SAT/ACT Writing & Language and AP English for high school). Every instruction, lesson and explanation is in
Traditional Chinese and English; the practice sentences and the child's writing are English.

- **173 skill units** — capitals and punctuation, grammar, sentences, words, paragraphs, organization, style and
  rhetoric, research and citations. Each opens with a mini-lesson, then gives endless drills built from random parts:
  pick the right answer, tap the wrong word, put sentences in order, or type the word. Two tries, then an explanation.
- **111 writing tasks** — narrative, personal narrative, opinion/argument, informative, how-to, letters, poems,
  descriptive, research, literary response, summary, compare & contrast; college essays, rhetorical analysis and
  synthesis in high school. Each task has 5+ topics to choose from and four steps:
  1. **Plan** with a graphic organizer
  2. **Draft** with sentence starters, words to try and a word counter (saved automatically)
  3. **Revise** with automatic feedback — capitals, end marks, "i", doubled words, common misspellings, overused words,
     repeated sentence openers, run-ons and choppy sentences, paragraphs, transitions and what the genre needs — the
     problems marked right in the text, plus a self-check rubric
  4. **Model**: an original mentor text for the task with a note on what makes it work
- **Skills quiz** (10 mixed questions per grade) and printable **worksheets** with an answer key.
- **My writing** lists every draft; drafts can be downloaded or printed. Everything is saved only in the browser.

## Files
```
index.html, style.css
js/app.js          pages: grades, skill practice, quiz, worksheet, the writing studio, my writing
js/util.js         random numbers, bilingual text, English helpers (plural, past, a/an), answer builders
js/check.js        checks drill answers (choice, tap, order, typed)
js/feedback.js     automatic feedback on a draft
js/bank/g01-03.js … g10-12.js   skills and writing tasks, three grades per file
js/bank/_example.js the format (not loaded)
SPEC.md            how to write skills and tasks
test/run.mjs       node test/run.mjs — draws 300 drills per skill and checks every task
```
