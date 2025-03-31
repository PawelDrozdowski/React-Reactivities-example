import { ChangeEvent, useEffect, useState } from "react";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../models/activity";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid"


export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { loading, updateActivity, createActivity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState<Activity>({
        id: "",
        title: "",
        date: "",
        description: "",
        category: "",
        city: "",
        venue: ""
    });
    useEffect(() => {
        if (id) loadActivity(id).then(activity => { if (activity) setActivity(activity) })
    }, [id, loadActivity])

    async function handleSubmit() {
        if (activity.id) {
            await updateActivity(activity);
            navigate(`/activities/${activity.id}`);
        }
        else {
            activity.id = uuid();
            await createActivity(activity);
            navigate(`/activities/${activity.id}`);
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }
    if (loadingInitial)
        return <LoadingComponent content="Loading activity..." />

    return (
        <Segment clearing>
            <Form onSubmit={() => handleSubmit()}>
                <Form.Input onChange={handleInputChange} placeholder="title" name="title" value={activity.title} />
                <Form.TextArea onChange={handleInputChange} placeholder="description" name="description" value={activity.description} />
                <Form.Input onChange={handleInputChange} placeholder="category" name="category" value={activity.category} />
                <Form.Input onChange={handleInputChange} type="date" placeholder="date" name="date" value={activity.date} />
                <Form.Input onChange={handleInputChange} placeholder="city" name="city" value={activity.city} />
                <Form.Input onChange={handleInputChange} placeholder="venue" name="venue" value={activity.venue} />
                <Button loading={loading} floated="right" positive type="submit" content="Submit" />
                <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
})