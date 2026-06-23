import { Button, Card } from "flowbite-react";
import type { WorkoutTemplate } from "../types";

interface TemplateCardProps {
    template: WorkoutTemplate | undefined
    isLoading: boolean
    error: Error | null
}

export default function TemplateCard({ template, isLoading, error }: TemplateCardProps) {
    if (isLoading) {
        return <Card>
            <div className="h-12 bg-gray-100 animate-pulse rounded-lg">
                <span className="sr-only">Loading...</span>
            </div>
        </Card>
    }

    if (error) {
        return <Card>
            <div className="text-red-500">Error loading templates</div>
        </Card>
    }

    if (!template) {
        return <Card>
            <p className="text-sm text-gray-400"> No templates created - create first template.</p>
        </Card>
    }
    return (
        <Card className="mt-2 mb-2">
            <div className="grid grid-rows-3 grid-flow-col gap-4 -mb-6">
                <div className='row-span-1 col-span-1 -mt-4 -ml-2'>
                    <h2 className=''>{template.name}</h2>
                </div>
                <div className='row-span-1 col-span-1 -mt-5 -ml-2 text-xs sm:text-sm md:text-lg'>
                    <h3>{template.exercises.length} exercises</h3>
                </div>
                <div className='row-span-1 col-span-1 -mt-8 -ml-2 text-xs sm:text-sm md:text-lg'>
                    <h3>{template?.description}</h3>
                </div>
                <div className='row-span-2 col-span-1'>
                    <div className='flex gap-2 justify-end'>
                        <Button color="alternative" size="sm" onClick={() => { }}>Edit</Button>
                        <Button color="red" size="sm" onClick={() => { }}>Delete</Button>
                    </div>
                </div>

            </div>
        </Card>
    )
}