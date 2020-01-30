/* eslint-disable react/require-default-props */
import React, { memo } from "react"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import { MyImage } from "../../shared/Image"
import SongMore from "./SongMore"
import SingleLineTexts from "../../shared/LinesTexts.styled"

export const MediaItemTypes = {
  ALBUM: "album",
  PLAY_LIST: "playList",
  SONG: "song",
  VIDEO: "video",
  ARTIST: "artist",
}

const StyledResultItem = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  dl {
    font-size: 14px;
    dt {
      color: ${props => props.theme.fg};
      margin-bottom: 6px;
      padding-right: 15px;
      ${SingleLineTexts}
      line-height: 1.3;
    }
    dd {
      padding-right: 15px;
      ${SingleLineTexts}
      font-size: 12px;
      color: ${props => props.theme.dg};
    }
  }
`

const ItemImg = memo(({ type, imgUrl }) => {
  let imgConfig = {
    width: 44,
    height: 44,
    borderRadius: "50%",
  }
  if (type === MediaItemTypes.ALBUM || type === MediaItemTypes.PLAY_LIST) {
    imgConfig = {
      width: 48,
      height: 48,
      borderRadius: "4px",
    }
  }
  if (type === MediaItemTypes.SONG) {
    imgConfig = { ...imgConfig, borderRadius: "4px" }
  }

  if (type === MediaItemTypes.VIDEO) {
    imgConfig = {
      width: 89,
      height: 50,
      borderRadius: "4px",
    }
  }

  const extraCss = css`
    width: ${imgConfig.width}px;
    height: ${imgConfig.height}px;
    min-width: ${imgConfig.width}px;
    min-height: ${imgConfig.height}px;
    border-radius: ${imgConfig.borderRadius};
    margin-right: 16px;
  `
  return <MyImage styledCss={extraCss} url={imgUrl} />
})

ItemImg.propTypes = {
  type: PropTypes.string,
  imgUrl: PropTypes.string,
}

const MediaItem = memo(({ imgUrl, title, desc, type, artistId, albumId }) => {
  const [artistName, albumName] = desc?.split(" · ") ?? ["", ""]
  return (
    <StyledResultItem>
      <ItemImg type={type} imgUrl={imgUrl} />
      <dl style={{ width: type === MediaItemTypes.VIDEO ? "70%" : "70%" }}>
        <dt>{title}</dt>
        <dd>{desc}</dd>
      </dl>
      {type === MediaItemTypes.SONG && (
        <SongMore
          songName={title}
          artistName={artistName}
          albumName={albumName}
          artistId={artistId}
          albumId={albumId}
        />
      )}
    </StyledResultItem>
  )
})

MediaItem.propTypes = {
  imgUrl: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  type: PropTypes.string,
  albumId: PropTypes.number,
  artistId: PropTypes.number,
}

export default MediaItem
