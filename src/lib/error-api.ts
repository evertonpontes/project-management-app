import z from "zod";

const errorApi = z.object({
  code: z.any(),
  message: z.string(),
});

export { errorApi };
