import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function NavBarMobile() {
    const navigate = useNavigate();
    return (
                <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t border-default">
                    <div className="grid h-full grid-cols-4 mx-auto font-medium">
                        <Button color="alternative" className="inline-flex flex-col h-full items-center justify-center px-5" onClick={() => navigate('/')}>
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" /></svg>
                            <span className="text-sm">Home</span>
                        </Button>
                        <Button color="alternative" className="inline-flex flex-col h-full items-center justify-center px-5" onClick={() => navigate('/session')}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Clock--Streamline-Guidance-Free" height="24" width="24">
                                <desc>
                                    Clock Streamline Icon: https://streamlinehq.com
                                </desc>
                                <path stroke="#000000" d="m17.5 17.5 -0.404 -0.566A19.67 19.67 0 0 0 12 12l0.055 -0.493A34.15 34.15 0 0 0 12 3.5M22.498 12c0 -5.798 -4.7 -10.498 -10.498 -10.498 -5.798 0 -10.498 4.7 -10.498 10.498 0 5.798 4.7 10.498 10.498 10.498 5.798 0 10.498 -4.7 10.498 -10.498Z" strokeWidth="1"></path>
                            </svg>
                            <span className="text-sm">Session</span>
                        </Button>
                        <Button color="alternative" className="inline-flex flex-col h-full items-center justify-center px-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Calendar--Streamline-Guidance-Free" height="24" width="24">
                                <desc>
                                    Calendar Streamline Icon: https://streamlinehq.com
                                </desc>
                                <path stroke="#000000" d="M7.5 6V1m10 5V1m4 16v4.5h-18v-3m17.863 -10H3.352M0.5 18.25v0.25h17.9l0.15 -0.25 0.234 -0.491A28 28 0 0 0 21.5 5.729V3.5h-18v2.128A28 28 0 0 1 0.743 17.744L0.5 18.25Z" strokeWidth="1"></path>
                            </svg>
                            <span className="text-sm">History</span>
                        </Button>
                        <Button color="alternative" className="inline-flex flex-col h-full items-center justify-center px-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Paper--Streamline-Guidance-Free" height="24" width="24">
                                <desc>
                                    Paper Streamline Icon: https://streamlinehq.com
                                </desc>
                                <path stroke="#000000" d="M13.5 1.5v7h7m-16 -7v21h16V8l-0.282 -0.126a12 12 0 0 1 -6.092 -6.092L14 1.5H4.5Z" strokeWidth="1"></path>
                            </svg>
                            <span className="text-sm">Templates</span>
                        </Button>
                    </div>
                </div>
    )
}