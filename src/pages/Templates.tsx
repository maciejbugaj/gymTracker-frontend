import TemplateCard from "../components/TemplateCard";
import { useWorkoutTemplates } from "../hooks/useWorkoutTemplates";

export default function Templates() {
    const { data: workoutTemplates, isLoading: isLoadingTemplates, error: errorTemplates } = useWorkoutTemplates()

    return (
        <div className='w-full px-4 pb-16'>
            <div className='p-4'>
                <h1>Templates</h1>
                <p className="text-gray-500 text-sm">Manage your workout templates</p>
            </div>
            <div className='grid'>
                <div className="mt-2 mb-1">
                    <h2>Your Templates</h2>
                </div>
                {workoutTemplates?.map(template => (
                    <TemplateCard template={template} isLoading={isLoadingTemplates} error={errorTemplates} key={template.id} />
                ))}
            </div>
        </div>
    )
}