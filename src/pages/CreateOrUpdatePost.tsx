export default {};

// import { Formik } from "formik";
// import "mapbox-gl/dist/mapbox-gl.css";
// import React, { useEffect, useState } from "react";
// import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import { useParams } from "react-router-dom";
// import { Button } from "shards-react";
// import * as Yup from "yup";
// import { createPost, getPostById, updatePost } from "../api/post.api";
// import { MyTextInput } from "../components/form/MyTextInput";
// import { Loading } from "../components/Loading";
// import { MyAlert, MyAlertState } from "../components/MyAlert";
// import {
//   UnknownErrorMyAlertState,
//   UNKNOWN_ERROR,
//   useAlert,
// } from "../hooks/useAlert";
// import { Post } from "../types/Post";
// import {
//   CenteredFormContainer,
//   CenteredForm,
// } from "../styledComponents/StyledForm";

// interface CreatePostInputType {
//   content: string | null;
// }

// type CreateOrUpdatePostAlertAction =
//   | { type: "CREATE_POST_SUCCESS"; createdPostId: string }
//   | { type: "UPDATE_POST_SUCCESS"; updatedPostId: string }
//   | { type: typeof UNKNOWN_ERROR };

// function createOrUpdatePostAlertReducer(
//   state: MyAlertState,
//   action: CreateOrUpdatePostAlertAction
// ): MyAlertState {
//   switch (action.type) {
//     case "CREATE_POST_SUCCESS":
//       return {
//         type: "success",
//         title: "Post created!",
//         link: {
//           to: `/post/${action.createdPostId}`,
//           text: "View post",
//         },
//       };
//     case "UPDATE_POST_SUCCESS":
//       return {
//         type: "success",
//         title: "Post updated!",
//         link: {
//           to: `/post/${action.updatedPostId}`,
//           text: "View post",
//         },
//       };
//     case UNKNOWN_ERROR:
//     default:
//       return UnknownErrorMyAlertState;
//   }
// }

// const CreateOrUpdatePost: React.FC = () => {
//   let { id } = useParams();

//   const {
//     alertOpen,
//     alertState,
//     openAlert,
//     onAlertClose,
//   } = useAlert<CreateOrUpdatePostAlertAction>(createOrUpdatePostAlertReducer);

//   const [postToUpdate, setPostToUpdate] = useState<Post | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchPostToUpdate() {
//       if (id) {
//         const post = await getPostById(id);
//         setPostToUpdate(post);
//       }

//       setLoading(false);
//     }

//     fetchPostToUpdate();
//   }, [id]);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <CenteredFormContainer>
//       <h1>{postToUpdate ? "Update" : "Create"} a post</h1>
//       <p>{postToUpdate ? "Update" : "Create"} your post.</p>

//       <Formik<CreatePostInputType>
//         validateOnBlur={false}
//         validateOnChange={false}
//         initialValues={{
//           content: postToUpdate ? postToUpdate.post.content : null,
//         }}
//         validationSchema={Yup.object({
//           content: Yup.string().required("Please enter content!"),
//         })}
//         onSubmit={async (values, { resetForm }) => {
//           try {
//             if (postToUpdate) {
//               await updatePost(postToUpdate.post.id, values.content!);
//               openAlert({
//                 type: "UPDATE_POST_SUCCESS",
//                 updatedPostId: postToUpdate.post.id,
//               });
//             } else {
//               const { post } = await createPost(values.content!);
//               openAlert({
//                 type: "CREATE_POST_SUCCESS",
//                 createdPostId: post.id,
//               });
//               resetForm();
//             }
//           } catch (e) {
//             console.log(e);
//             openAlert({ type: UNKNOWN_ERROR });
//           }
//         }}
//       >
//         {({ handleSubmit, isSubmitting, values }) => (
//           <CenteredForm onSubmit={handleSubmit}>
//             <MyAlert
//               open={alertOpen}
//               state={alertState}
//               onClose={onAlertClose}
//               className="mb-4"
//             />

//             <MyTextInput
//               value={values.content || ""}
//               name="content"
//               label="Content"
//               placeholder="Enter post content"
//               className="mb-0"
//             />

//             <div className="d-flex mt-3">
//               <Button disabled={isSubmitting} type="submit">
//                 {postToUpdate ? "Update post!" : "Create post!"}
//               </Button>
//             </div>
//           </CenteredForm>
//         )}
//       </Formik>
//     </CenteredFormContainer>
//   );
// };

// export default CreateOrUpdatePost;
