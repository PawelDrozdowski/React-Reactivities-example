import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../app/api/agent";

export default class ActivityStore {
    activityRegisty = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegisty.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }
    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => this.setActivity(activity));
                this.setLoadingInitial(false);
            });
        } catch (e) {
            console.log(e);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        const activityMemory = this.getActivity(id);
        if (activityMemory) {
            this.selectedActivity = activityMemory;
            return activityMemory;
        }

        this.setLoadingInitial(true);
        try {
            const activity = await agent.Activities.details(id);
            runInAction(() => {
                this.setActivity(activity);
                this.selectedActivity = activity;
                this.setLoadingInitial(false);
            });
            return activity;
        } catch (e) {
            console.log(e);
            this.setLoadingInitial(false);
        }

    }
    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split("T")[0];
        this.activityRegisty.set(activity.id, activity);
    }
    private getActivity = (id: string) => this.activityRegisty.get(id);

    private setLoadingInitial = (value: boolean) => this.loadingInitial = value;

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegisty.get(id);
    }


    createActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegisty.set(activity.id, activity);
                this.selectActivity(activity.id);
                this.loading = false;
            })
        } catch (e) {
            console.log(e);
            runInAction(() => this.loading = false);
        }
    }
    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegisty.set(activity.id, activity);
                this.selectActivity(activity.id);
                this.loading = false;
            })
        } catch (e) {
            console.log(e);
            runInAction(() => this.loading = false);
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegisty.delete(id);
                this.loading = false;
            });
        } catch (e) {
            console.log(e);
            runInAction(() => this.loading = false);
        }
    }
}