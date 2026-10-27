# Composition Study Template

A template for posting artworks created for a composition study.

# Dependencies

- [bun](https://bun.sh/)

# Install

First start your own repository using this one as a template, then...

```bash
git clone <your-repo>
bun install
```

# Customise

You will need to update various files to make this template your own.

### `vite.config.ts`

Change this file to match the name of your github repository - this will define the location of your website for github pages.

```ts
export default defineConfig({
	base: '/name-of-your-github-repo',
	...
})
```

### `index.html`

Add the title of your study, your own name, and the project description. This is for accessibility.

```html
<html lang="en">
	<head>
		<title>Title</title>
		...
		<meta name="author" content="author" />
		...
		<meta name="description" content="description" />
		...
	</head>
	...
</html>
```

### `public/manifest.json`

Again add the title of your study, and the project description. This is for SEO and accessibility.

```json
{
	...
	"description": "description",
	...
	"name": "Title",
	"short_name": "short-title",
	...
}
```

By default the webpage is not indexable by search engines, which can be changed in `public/robots.txt`.

### `public/audio`

Add your audio files here! Ideally in mp3 format for faster loading.

### `src/index.tsx`

Add the title of your project, your name, a description of the project, and any acknowledgements such as grants and ethics. You can also set your submission to be randomised on every page load using `randomise_config`.

```tsx
<header>
	<h1>Title</h1>
	<h2>curated by ...</h2>
	<p>description and links</p>
</header>
<main>
	<Submissions randomise_config={true} />
</main>
<footer>
	<p>acknowledgements</p>
	...
</footer>
```

### `src/config.ts`

Here you will create a list of information about your participants and the work they created. To do this, you will create an object of the type `SubmissionJSON` for each participant.

```ts
type SubmissionJSON = {
	author?: {
		name: string
		links: { href: string; type: 'instagram' | 'vimeo' | 'website' }[]
		quote?: string
	}
	audio?: string[]
	video?: string[]
}
```

For example, to include one of my own compositions, you would write:

```ts
export const config: SubmissionJSON[] = [
	{
		author: {
			name: 'Lewis Wolstanholme',
			links: [
				{
					href: 'https://lewiswolstanholme.co.uk',
					type 'website',
				},
				{
					href: 'julia___set',
					type 'instagram',
				},
			],
		},
		audio: '<name-of-file-in-public/audio>',
		video: ['youtube-hash-0', 'youtube-hash-1'],
	}
] as const
```

# Develop

```bash
bun run dev
bun run format
```

# Test

```bash
bun run test
```

# Upload to Github Pages

```bash
bun run deploy
```

# Updating the Template

```bash
git remote add template https://github.com/lewiswolf/composition-study-template
git fetch --all
git merge template/master --allow-unrelated-histories
```
