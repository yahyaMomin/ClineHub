import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

import './style.scss'

import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'
import useFetch from '../../../hooks/usefetch'
import Genres from '../../../components/genres/Genres'
import CircleRating from '../../../components/circleRating/CircleRating'
import Img from '../../../components/lazyLoadImage/Image'
import PosterFallback from '../../../assets/no-poster.png'
import { PlayIcon } from '../PlayIcon'
import VideoPopup from '../../../components/videopopup/VideoPopup'

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false)
  const [videoId, setVidoeId] = useState(null)

  const { mediaType, id } = useParams()
  const { data, loading } = useFetch(`/${mediaType}/${id}`)

  const { url } = useSelector((state) => state.Home)

  const _genres = data?.genres?.map((g) => g.id)

  const director = crew?.filter((f) => f.job === 'Director')

  const writer = crew?.filter((f) => f.job === 'screenplay' || f.job === 'Writer')

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
  }
  let movieName = data?.name || data?.title
  const updatedMovieName = movieName?.replaceAll(' ', '-')

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url.backdrop + data?.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img className="posterImg" src={url.backdrop + data.poster_path} />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">{`${data.name || data.title}`}</div>
                    <div className="subtitle">{data?.tagline}</div>
                    <Genres data={_genres} />
                    <div className="download-btn">
                      <a href={`https://vegamovies.ong/download-${updatedMovieName}`}>Download Now</a>
                    </div>

                    <div className="row">
                      {data?.vote_average ? <CircleRating rating={data?.vote_average.toFixed(1)} /> : ''}
                      <div
                        className="playbtn"
                        onClick={() => {
                          setShow(true)
                          setVidoeId(video.key)
                        }}
                      >
                        <PlayIcon />
                        <span className="text">Watch Trailer</span>
                      </div>
                    </div>
                    <div className="overview">
                      <div className="heading">OverView</div>

                      <div className="description">{data.overview}</div>
                    </div>
                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItem">
                          <span className="text bold">release Date: </span>
                          <span className="text">{dayjs(data.release_date).format('MMM D, YYYY')}</span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItem">
                          <span className="text bold">RunTime: </span>
                          <span className="text">{toHoursAndMinutes(data.runtime)}</span>
                        </div>
                      )}
                    </div>
                    {director?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Director </span>
                        <span className="text">
                          {director.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {director.length - 1 !== i && ' , '}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {writer?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Writer </span>
                        <span className="text">
                          {writer.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {writer.length - 1 !== i && ' , '}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {data.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Creator : </span>
                        <span className="text">
                          {data.created_by?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data.created_by?.length - 1 !== i && ' , '}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <VideoPopup show={show} setShow={setShow} videoId={videoId} setVideoId={setVidoeId} />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  )
}

export default DetailsBanner
