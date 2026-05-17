// dependencies
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// src
import { Submissions } from './components/index.tsx'
import './scss/index.scss'

createRoot(document.querySelector('#root') as NonNullable<HTMLDivElement>).render(
	<StrictMode>
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
			<a href='https://lewiswolstanholme.co.uk' rel='noreferrer' target='_blank'>
				web design by lewis wolstanholme
			</a>
		</footer>
	</StrictMode>,
)
