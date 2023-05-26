import Link from 'next/link'
import React from 'react';
import styles from './PlayerLink.module.css'

const PlayerLink = ({player}) => {
    if(player.id > 0)
    return (
        <Link href={`/player/${player.id}`}><a className={styles.playerLinkA}>{player.name}</a></Link>
    )

    return (
        <div>{player.name}</div>
    )
}
export default PlayerLink;
