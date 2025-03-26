import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../app/api/agent";
import { v4 as uuid } from "uuid"

export default class ActivityStore {
    activityRegisty = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegisty.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }
    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => {
                    activity.date = activity.date.split("T")[0];
                    this.activityRegisty.set(activity.id, activity);
                });
                this.setLoadingInitial(false);
            });
        } catch (e) {
            console.log(e);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (value: boolean) => this.loadingInitial = value;

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegisty.get(id);
        this.closeForm();
    }
    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
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
                if (id !== this.selectedActivity?.id)
                    return;
                this.cancelSelectActivity();
            });
        } catch (e) {
            console.log(e);
            runInAction(() => this.loading = false);
        }
    }
}