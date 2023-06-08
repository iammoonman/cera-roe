import React, { useEffect, useRef, useState } from "react";
import DraftContainer from "../draftContainer";
import { Draft } from "../json/draft";

interface Props {
	drfts: Draft[];
}
interface State {
	showndraft: Draft;
}

const EventScroller = (props: Props) => {
	const [state, setState] = useState<State>({ showndraft: props.drfts[0] });
	const ref = useRef<HTMLDialogElement>(null);
	const handleClose = () => {
		ref.current?.close();
	};
	const handleOpen = (d: Draft) => {
		ref.current?.showModal();
		setState((st) => ({ showndraft: d }));
	};
	return (
		<div className="blockbg">
			<h4 className="mx-auto text-3xl text-center">Past Events</h4>
			<div style={{ overflowY: "scroll", maxHeight: "400px" }}>
				<div className="grid grid-cols-1">
					<div className="flex border-b-2 sticky top-0 bg-[#EFEDED] h-9 p-2 items-center">
						<div className="w-4/5 font-bold">Event</div>
						<div className="font-bold">Date</div>
					</div>
					{props.drfts.map((d, i) => (
						<div key={i} onClick={() => handleOpen(d)} className="cursor-pointer flex h-9 p-2 hover:bg-opacity-40 hover:bg-gray-300 items-center">
							<div className="w-4/5">{d.title}</div>
							<div className="">{new Date(d.date).toDateString()}</div>
						</div>
					))}
				</div>
			</div>
			<dialog ref={ref}>
				<div className="relative lg:w-1/2 max-lg:w-full">
					<button className="absolute left-1/2 top-6 -translate-x-1/2 rounded-2xl px-3 py-2 font-semibold text-sm shadow-sm bg-gray-400 hover:bg-gray-300" onClick={() => handleClose()}>
						X
					</button>
					<DraftContainer draft={state.showndraft} showExtras={true} showRounds={true} />
				</div>
			</dialog>
		</div>
	);
};
export default EventScroller;
