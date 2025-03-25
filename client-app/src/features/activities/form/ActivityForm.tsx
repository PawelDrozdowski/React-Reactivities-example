import { ChangeEvent, useState } from "react";
import { Activity } from "../../../models/activity";
import { Button, Form, Segment } from "semantic-ui-react";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    submitting: boolean;
}

export default function ActivityForm({ activity: selectedActivity, closeForm, createOrEdit, submitting }: Props) {
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
        createOrEdit(activity);
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
                <Button loading={submitting} floated="right" positive type="submit" content="Submit" />
                <Button onClick={() => closeForm()} floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
}