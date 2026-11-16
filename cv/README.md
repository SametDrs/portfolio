# CV

`cv.tr.html` and `cv.en.html` are the sources of the downloadable CVs served
from `public/cv.pdf` (Turkish) and `public/cv-en.pdf` (English). Both share
`cv.css`, which loads the Anton font from `node_modules` (run `npm install`
first).

After editing a source file, regenerate its PDF with headless Edge (Git Bash,
from the project root):

```bash
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$EDGE" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$(cygpath -w "$PWD/public/cv.pdf")" \
  "file:///$(cygpath -m "$PWD")/cv/cv.tr.html"
"$EDGE" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$(cygpath -w "$PWD/public/cv-en.pdf")" \
  "file:///$(cygpath -m "$PWD")/cv/cv.en.html"
```

Each CV is meant to fit on a single A4 page; check the page count after
regenerating.
