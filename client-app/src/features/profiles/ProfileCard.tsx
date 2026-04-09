import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';

interface Props {
    profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {
    function truncate(str: string | undefined, amountToShow: number = 40) {
        if (str) {
            return str.length > amountToShow && amountToShow > 3
                ? str.substring(0, amountToShow - 3) + '...'
                : str;
        }
        return "";
    }

    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{truncate(profile.bio)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                20 followers
            </Card.Content>
        </Card>
    )
})