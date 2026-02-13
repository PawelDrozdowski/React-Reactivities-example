import { useEffect, useState } from "react";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../models/activity";
import { Button, Segment, Header } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyDateInput from "../../../app/common/form/MyDateInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import { v4 as uuid } from "uuid"


export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { loading, updateActivity, createActivity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState<Activity>({
        id: "",
        title: "",
        date: null,
        description: "",
        category: "",
        city: "",
        venue: ""
    });
    const validationSchema = Yup.object({
        title: Yup.string().required("The title is required"),
        description: Yup.string().required("The description is required"),
        category: Yup.string().required("The category is required"),
        date: Yup.string().required("The date is required"),
        venue: Yup.string().required("The venue is required"),
        city: Yup.string().required("The city is required")
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => { if (activity) setActivity(activity) })
    }, [id, loadActivity])

    async function handleFormSubmit(activity: Activity) {
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

    if (loadingInitial)
        return <LoadingComponent content="Loading activity..." />

    return (
        <Segment clearing>
            <Header content="Activity Details" sub color="teal" />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit}>
                        <MyTextInput name="title" placeholder="Title" />

                        <MyTextArea placeholder="description" name="description" rows={3} />
                        <MySelectInput placeholder="category" name="category" options={categoryOptions} />
                        <MyDateInput
                            placeholderText="date"
                            name="date"
                            showTimeSelect
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <Header content="Location Details" sub color="teal" />
                        <MyTextInput placeholder="city" name="city" />
                        <MyTextInput placeholder="venue" name="venue" />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading}
                            floated="right"
                            positive
                            type="submit"
                            content="Submit" />
                        <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
                    </Form>
                )}

            </Formik>

        </Segment>
    )
})