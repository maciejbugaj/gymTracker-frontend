import TemplateCard from "../components/TemplateCard";
import { useWorkoutTemplates } from "../hooks/useWorkoutTemplates";

export default function Templates() {
    const { data: workoutTemplates, isLoading: isLoadingTemplates, error: errorTemplates } = useWorkoutTemplates()

    return (
        <div className='w-full px-4 pb-16'>
            <div className='p-4'>
                <h1>Templates</h1>
                <h3>Manage templates</h3>
            </div>
            <div className='grid'>
                <div className="mt-2">
                    <div className="flex">
                        <h3>YOUR TEMPLATES</h3>
                    </div>
                </div>
                {workoutTemplates?.map(template => (
                    <TemplateCard template={template} isLoading={isLoadingTemplates} error={errorTemplates} key={template.id} />
                ))}
            </div>
        </div>
    )
}