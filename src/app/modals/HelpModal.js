"use client";
import React from "react";

export default function HelpModal({ showModal, setShowModal }) {
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
                  <h3 className="text-3xl font-semibold">❔Help </h3>
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
                    <p>
                      <div className="flex gap-4">
                        <div>
                          In:
                          <div
                            className="h-4 w-4"
                            style={{ backgroundColor: "#BAE6FD" }}
                          ></div>
                        </div>
                        <div>
                          Out:
                          <div
                            className="h-4 w-4"
                            style={{ backgroundColor: "#075985" }}
                          ></div>
                        </div>
                      </div>{" "}
                      👤
                      <b>Author:</b> Creates the Story by Connecting Paths
                      between cards. <br /> Can attach
                      <ol className="text-sm flex gap-2">
                        <li>Image</li>
                        <li>Text</li>
                        <li>Audio</li>
                      </ol>
                      to make the story.
                      <br />
                      Click Paths to unconnect cards
                    </p>

                    <hr className="my-8" />
                    <p>
                      <div className="flex gap-4">
                        <div>
                          In:
                          <div
                            className="h-4 w-4"
                            style={{ backgroundColor: "#34D399" }}
                          ></div>
                        </div>
                        <div>
                          Out:
                          <div
                            className="h-4 w-4"
                            style={{ backgroundColor: "#064E3B" }}
                          ></div>
                        </div>
                      </div>
                      👤
                      <b>Reader:</b> Follows Story by Connecting Cards. <br />
                      Can't unconnect cards user must progress
                    </p>
                    <hr className="my-8" />
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
