import { useRef } from "react";

const Privacy = ({
    onChange,
}) => {
    const inputRef = useRef(null)

    return (
        <>
            <div className="mb-6">
                <label className="text-base font-medium leading-6 text-formLabelColor">隱私權</label>
                <div className="mt-10 space-y-10">
                    <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-white">By Email</legend>
                    <div className="mt-6 space-y-6">
                        <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                            <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                            />
                        </div>
                        <div className="text-sm leading-6">
                            <label htmlFor="comments" className="font-medium text-white">
                            Comments
                            </label>
                            <p className="text-gray-400">Get notified when someones posts a comment on a posting.</p>
                        </div>
                        </div>
                        <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                            <input
                            id="candidates"
                            name="candidates"
                            type="checkbox"
                            className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                            />
                        </div>
                        <div className="text-sm leading-6">
                            <label htmlFor="candidates" className="font-medium text-white">
                            Candidates
                            </label>
                            <p className="text-gray-400">Get notified when a candidate applies for a job.</p>
                        </div>
                        </div>
                        <div className="relative flex gap-x-3">
                        <div className="flex h-6 items-center">
                            <input
                            id="offers"
                            name="offers"
                            type="checkbox"
                            className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                            />
                        </div>
                        <div className="text-sm leading-6">
                            <label htmlFor="offers" className="font-medium text-white">
                            Offers
                            </label>
                            <p className="text-gray-400">Get notified when a candidate accepts or rejects an offer.</p>
                        </div>
                        </div>
                    </div>
                    </fieldset>
                </div>
            </div>
        </>
    )
}
export default Privacy