import { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";


export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { selectedActivity, loading, updateActivity, createActivity } = activityStore
    const initialState = selectedActivity ?? {
        id: "",
        title: "",
        date: "",
        description: "",
        category: "",
        city: "",
        venue: ""
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        activity.id ? updateActivity(activity) : createActivity(activity)
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

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
                <Button onClick={() => activityStore.closeForm()} floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
})