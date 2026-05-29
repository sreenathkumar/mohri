import { Alert, AlertDescription } from '@/components/shadcn/alert'
import React from 'react'

interface Props {
    status: string,
    message: string,
}


function DynamicAlert({ state }: { state: Props | undefined }) {
    return (
        <>
            {state?.status && (
                <Alert variant={state.status === 'success' ? 'success' : 'destructive'}>
                    {state?.message && (
                        <AlertDescription>
                            {state.message}
                        </AlertDescription>
                    )}
                </Alert>
            )}
        </>
    )
}

export default DynamicAlert