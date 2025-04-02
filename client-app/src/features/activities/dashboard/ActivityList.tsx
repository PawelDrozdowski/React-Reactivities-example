import { Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../stores/store";
import ActivityListItem from "./ActivityListItem";
import { Fragment } from "react/jsx-runtime";

export default observer(function ActivityList() {
    const { activityStore } = useStore();
    const { grouppedActivities } = activityStore;
    return (
        <>
            {grouppedActivities.map(([group, activities]) => {
                return (
                    <Fragment key={group}>
                        <Header color="teal">
                            {group}
                        </Header>
                        {activities.map(activity => (
                            <ActivityListItem key={activity.id} activity={activity} />
                        ))}
                    </Fragment>
                )
            })}
        </>
    )
})
