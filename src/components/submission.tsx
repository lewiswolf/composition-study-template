// biome-ignore-all lint/a11y/useMediaCaption : the audio file is intended as music, and likely does not have captions
/* eslint-disable @eslint-react/dom-no-unsafe-iframe-sandbox */
/* eslint-disable @eslint-react/set-state-in-effect */
/* eslint-disable react-hooks/set-state-in-effect */

// dependencies
import { type FC, type JSX, Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Playbar } from 'maxmsp-gui'

// src
import type { SubmissionJSON } from '../config.ts'
import '../scss/submission.scss'

// constexpr
const _defaultArray: string[] = []
const _defaultVoidFunction = (): void => {
	/* */
}

export const Submission: FC<{
	author?: SubmissionJSON['author']
	audio?: SubmissionJSON['audio']
	video?: SubmissionJSON['video']
	updatePlaying?: boolean
	onPlay?: (b: boolean) => void
}> = ({ author, audio = _defaultArray, video = _defaultArray, updatePlaying = false, onPlay = _defaultVoidFunction }) => {
	/*
	Generates an interactive submission from a given object of type SubmissionJSON.
	*/

	// set playbar width relative to parent width
	const self = useRef<HTMLDivElement>(null)
	const [width, setWidth] = useState<number>(0)
	useEffect((): (() => void) => {
		const listener = (): void => {
			setWidth(self.current?.clientWidth ?? 0)
		}
		window.addEventListener('resize', listener)
		listener()
		return (): void => {
			window.removeEventListener('resize', listener)
		}
	}, [])

	// synchronise the audio and the slider
	const audio_ref = useRef<HTMLAudioElement>(null)
	const [audio_playing, setAudioPlaying] = useState<boolean>(false)
	const [audio_time, setAudioTime] = useState<number>(0)
	const interval = useRef<number | null>(null)
	// toggle playing, fire call back, and destroy interval
	const setPlaying = useCallback((b: boolean): void => {
		setAudioPlaying(b)
		if (!b && interval.current) {
			window.clearInterval(interval.current)
			interval.current = null
		}
	}, [])
	// update playing
	useEffect((): void => {
		setPlaying(updatePlaying)
		if (updatePlaying) {
			void audio_ref.current?.play()
		} else {
			audio_ref.current?.pause()
		}
	}, [updatePlaying, setPlaying])
	// run an interval to keep track of time
	useEffect((): void => {
		if (audio_playing) {
			interval.current = window.setInterval((): void => {
				if (audio_ref.current && !audio_ref.current.ended) {
					setAudioTime(audio_ref.current.currentTime / audio_ref.current.duration)
				} else {
					setPlaying(false)
					setAudioTime(0)
					onPlay(false)
				}
			}, 10)
		}
	}, [audio_playing, onPlay, setPlaying])
	// clean up on unmount
	useEffect((): (() => void) => {
		const cleanup_audio = audio_ref.current
		return (): void => {
			cleanup_audio?.pause()
			if (interval.current) {
				clearInterval(interval.current)
			}
		}
	}, [])

	// event handlers
	const _onChange = (v: number): void => {
		// scrub through the audio
		setAudioTime(v)
		if (audio_ref.current) {
			audio_ref.current.currentTime = v * audio_ref.current.duration
		}
	}
	const _onPlay = (b: boolean): void => {
		// play or pause the audio
		if (b && audio_ref.current) {
			setPlaying(true)
		} else {
			audio_ref.current?.pause()
			setPlaying(false)
		}
		onPlay(b)
	}

	return (
		<div className='submission' ref={self}>
			{audio.length > 0 &&
				audio.map((filename: string) => (
					<Fragment key={filename}>
						<audio ref={audio_ref} src={`${import.meta.env.BASE_URL}/audio/${filename}`} />
						<Playbar
							ariaLabel={author ? `audio player for ${author.name.toLowerCase()}` : 'audio player'}
							onChange={_onChange}
							onPlay={_onPlay}
							setPlaying={audio_playing}
							setValue={audio_time}
							width={width}
						/>
					</Fragment>
				))}
			{video.length > 0 && (
				<div className='videos'>
					{video.map((hash: string) => (
						<iframe
							allow='autoplay; encrypted-media; fullscreen; picture-in-picture; web-share'
							key={hash}
							referrerPolicy='strict-origin-when-cross-origin'
							sandbox='allow-scripts allow-same-origin'
							src={`https://www.youtube.com/embed/${hash}?theme=dark&color=white`}
							title={author ? author.name : 'anonymous'}
						/>
					))}
				</div>
			)}
			<h3>{author ? author.name.toLowerCase() : 'anonymous'}</h3>
			{author?.links.map((obj: { href: string; type: 'instagram' | 'vimeo' | 'website' }): JSX.Element => {
				const _href = (): string => {
					switch (obj.type) {
						case 'instagram':
							return `https://instagram.com/${obj.href}`
						case 'vimeo':
							return `https://vimeo.com/${obj.href}`
						default:
							return obj.href
					}
				}
				return (
					<p key={obj.href}>
						<i>{obj.type}</i>
						<span> : </span>
						<a href={_href()} rel='noreferrer' target='_blank'>
							{obj.href.replace(/.+\/\/|www.|/gu, '')}
						</a>
					</p>
				)
			})}
		</div>
	)
}
