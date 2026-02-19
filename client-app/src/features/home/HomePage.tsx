import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();
    return (
        <Segment inverted vertical textAlign="center" className="masthead">
            <Container text>
                <Header as="h1" inverted>
                    <Image size="massive" src="/assets/logo.png" alt="logo" style={{ marginBottom: 12 }} />
                    Reactivities
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as="h2" inverted content="Welcome to Reactivities" />
                        <Button inverted as={Link} to="/activities" size="huge">
                            Go to Activities
                        </Button>
                    </>
                ) :
                    (
                        <>
                            <Button inverted onClick={() => modalStore.openModal(<LoginForm />)} size="huge">
                                Login
                            </Button>
                            <Button inverted onClick={() => modalStore.openModal(<RegisterForm />)} size="huge">
                                Register
                            </Button>
                        </>
                    )
                }
            </Container>
        </Segment>
    )
})