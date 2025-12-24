import { type FC, useState } from 'react'
// src
import { type SubmissionJSON, config } from '../config.ts'
import { Submission } from './submission.tsx'

const random_config_cache: readonly SubmissionJSON[] = config.sort(() => Math.random() - 0.5)

export const Submissions: FC<{
	randomise_config?: boolean
}> = ({ randomise_config = true }) => {
	/*
	This component renders an array of submissions, making sure that only submission is allowed to be playing at
	*/

	const [index_playing, setIndex] = useState<number>(0)
	return (
		<>
			{(randomise_config ? random_config_cache : config).map((S: SubmissionJSON, i: number) => (
				<Submission
					{...S}
					key={i.toString()}
					updatePlaying={index_playing === i + 1}
					onPlay={(b: boolean) => {
						if (b) {
							setIndex(i + 1)
						} else {
							setIndex(0)
						}
					}}
				/>
			))}
		</>
	)
}
