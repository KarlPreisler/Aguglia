Aguglia Persa — FLAT VERSION
============================
Every file sits at the same level. There are no subfolders, so there is
nothing for an upload to lose.

Use this if the normal version lost its assets/ and images/ folders on the
way to GitHub. It is the identical website — same pages, same photographs,
same styling — only the file paths are flattened:

    assets/style.css   ->   style.css
    assets/main.js     ->   main.js
    assets/fonts/*     ->   *.woff2
    images/*.webp      ->   *.webp


HOW TO UPLOAD
  1. Open your repository on github.com
  2. Add file -> Upload files
  3. Select ALL 84 files inside this folder (Ctrl+A in Explorer) and drag
     them onto the page in ONE go
  4. Scroll down, write a commit message, click "Commit changes"
  5. Wait 1-2 minutes, then hard-refresh the site (Ctrl+F5)

Because there are no folders, dragging loose files is exactly right here —
which is the whole point of this version.

  !! Do not delete the CNAME file that is already in your repository.
     Nothing in this folder is called CNAME, so just leave it alone.

  !! Delete the old style.css / main.js from the repository root only if
     they were not yours to begin with. Uploading these overwrites any file
     of the same name automatically.


IF THE SITE STILL LOOKS UNSTYLED
Check Settings -> Pages -> "Build and deployment". The Source branch and
folder shown there must be where you just uploaded. If it says /docs and you
uploaded to the root, nothing you upload to the root will ever appear.


TO SHOW A NIGHTLY RATE LATER
In room-1.html, room-2.html or whole-house.html find:

    <p class="price price--ask">Rates on request ...</p>

and replace it with:

    <p class="price"><span class="price__n">&euro;95</span> <span class="price__u">per night</span></p>
