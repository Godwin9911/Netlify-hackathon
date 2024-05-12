"use client";
import React, { useMemo } from "react";
import { arti } from "../font";

export default function SummaryModal({
  showModal,
  setShowModal,
  schema,
  storyTitle = "",
}) {
  const selectedNodes = useMemo(() => {
    const inputs = schema.links?.filter((link) =>
      link.input.includes("Reader")
    );

    console.log(inputs);

    const foundNodes = inputs.map((el) =>
      schema.nodes.find((node) => {
        console.log(node);
        return node?.inputs?.find((ipt) => ipt.id === el.input);
      })
    );

    /*    schema.nodes.filter((node) => {
      if (!node?.inputs) return false;
      return node.inputs.find((el) =>
        inputs.find((link) => link.input == el.id)
      );
    }); */

    console.log(foundNodes);
    return foundNodes;
  }, [schema]);
  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            style={{ zIndex: "200" }}
          >
            <div className="relative w-auto my-6 mx-auto min-w-3xl max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">📄 Summary </h3>
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
                <div
                  className={`relative p-4 flex-auto ${arti.className}`}
                  style={{ height: "70vh", minWidth: "30vw", overflow: "auto" }}
                >
                  <h4 className="text-2xl font-semibold mb-4 text-center">
                    {storyTitle}
                  </h4>
                  <div className="my-0 text-blueGray-500 text-lg leading-relaxed">
                    {selectedNodes.map(({ data }, index) => (
                      <div
                        key={index}
                        class="p-0 bg-white rounded-xl transform transition-all -hover:-translate-y-1 duration-300 relative pt-2"
                      >
                        <div className="p-0">
                          {data?.blob && (
                            <div className="flex justify-center">
                              <img
                                class="object-cover h-40 w-full"
                                //  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                                // src={data?.blob ? URL.createObjectURL(data.blob) : ""}
                                src={`/.netlify/functions/getfile/${data?.blob}`}
                                alt=""
                              />
                            </div>
                          )}

                          <div class="p-2 pb-0 mb-0">
                            <h2 class="font-bold text-md mb-2 p-1 text-md">
                              {data.title || "..."}
                            </h2>
                            <p class={` text-gray-600 p-1`}>
                              {data.paragraph || "..."}
                            </p>
                            {data?.blobAudio && (
                              <audio
                                src={`/.netlify/functions/getfile/${data?.blobAudio}`}
                                controls
                                className="mt-2 w-full"
                              />
                            )}{" "}
                          </div>
                        </div>
                      </div>
                    ))}
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
