"use client";
import React from "react";
import { sciFiSample } from "../helpers";

export default function SampleStoriesModal({
  showModal,
  setShowModal,
  populateData,
}) {
  const stories = [
    {
      name: "Sci-fi",
      storyData: sciFiSample,
    },
  ];
  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            style={{ zIndex: "200" }}
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Sample Stories </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-4 flex-auto">
                  <div className="my-0 text-blueGray-500 text-lg leading-relaxed">
                    <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Select
                    </p>
                    <ul class="my-4 space-y-3">
                      {stories.map((el, i) => (
                        <li key={i}>
                          <button
                            onClick={() => {
                              populateData({ storyFound: el.storyData });
                              setShowModal(false);
                            }}
                            class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow"
                          >
                            <span class="flex-1 ms-3 whitespace-nowrap">
                              Sci-fi
                            </span>
                            {/* <span class="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">
                              Popular
                            </span> */}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {/*   <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          <div
            className="opacity-40 fixed inset-0 z-40 bg-black"
            style={{ zIndex: "199" }}
            onClick={() => setShowModal(false)}
          ></div>
        </>
      ) : null}
    </>
  );
}
