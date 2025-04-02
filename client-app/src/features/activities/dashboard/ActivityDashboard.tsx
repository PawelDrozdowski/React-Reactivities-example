import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

export default observer(function ActivityDashboard() {
    const { activityStore } = useStore();
    const { loadActivities, activityRegisty } = activityStore;

    useEffect(() => {
        if (activityRegisty.size <= 1) loadActivities();
    }, [loadActivities, activityRegisty.size]);


    if (activityStore.loadingInitial)
        return <LoadingComponent content='Loading app' />

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})