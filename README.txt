Aguglia Persa — agugliapersa.com
================================
Deploying to GitHub Pages (your current setup)

WHAT THIS FOLDER IS
Everything here is the finished website. Plain HTML, CSS and JavaScript —
no build step, no dependencies, nothing to install. Any host serves it.

  index.html            the farm
  room-1.html           Room 1 with the lounge
  room-2.html           Room 2
  whole-house.html      both rooms together
  404.html              shown when a URL doesn't exist
  assets/style.css      all the styling
  assets/main.js        galleries, lightbox, request form, map
  assets/fonts/         Bodoni Moda + Familjen Grotesk, served from your domain
  images/               66 photographs, WebP
  favicon.svg / .ico / -32.png / -96.png, apple-touch-icon.png
  robots.txt, sitemap.xml
  .nojekyll             tells GitHub Pages to serve the files as they are


!! BEFORE YOU UPLOAD — ONE THING !!
Your repository has a file at its root called CNAME. It holds your domain
name and it is the only reason agugliapersa.com points at the site.

  DO NOT DELETE IT. DO NOT REPLACE IT.

Nothing in this folder is called CNAME, so as long as you don't delete it
yourself, you're fine.

Open it and check what it says. If it reads

      www.agugliapersa.com        -> nothing to do, the site is set up for this
      agugliapersa.com            -> tell Claude, so the canonical tags and
                                     sitemap can be flipped to match


OPTION A — GITHUB WEBSITE, NO TOOLS NEEDED
  1. Open your repository on github.com
  2. Add file -> Upload files
  3. Drag in everything from THIS folder EXCEPT the images folder
     (index.html, the three room pages, 404.html, assets, robots.txt,
      sitemap.xml, the favicons, .nojekyll)
  4. Commit
  5. Add file -> Upload files again, this time drag in the images folder
     on its own (66 files — do it separately so the uploader doesn't choke)
  6. Commit
  7. Wait 1-2 minutes, then load agugliapersa.com and hard-refresh
     (Ctrl+F5) to get past your browser's cache

  Uploading index.html replaces the old one automatically. Old files you no
  longer use can be deleted afterwards from the repository page.


OPTION B — GIT, IF YOU HAVE IT SET UP
  git clone https://github.com/<you>/<repo>.git
  cd <repo>
  (copy everything from this folder in, keeping the existing CNAME file)
  git add -A
  git commit -m "Rebuild the site: room pages, direct booking, new photographs"
  git push


AFTER IT'S LIVE
  - Repository Settings -> Pages -> tick "Enforce HTTPS"
  - Open the site on your phone and send yourself a test request from
    room-1.html to check the email opens correctly
  - Google Search Console -> add agugliapersa.com -> submit
    https://www.agugliapersa.com/sitemap.xml


TO SHOW A NIGHTLY RATE LATER
Open room-1.html, room-2.html or whole-house.html and find this line:

    <p class="price price--ask">Rates on request ...</p>

Replace it with:

    <p class="price"><span class="price__n">&euro;95</span> <span class="price__u">per night</span></p>

The comment just above it in each file says the same.


TO CHANGE THE WHATSAPP NUMBER
Search every file for 393518748954 and replace it.
