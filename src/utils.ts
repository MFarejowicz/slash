import { Result } from "./useSlash";

export function parseResult(result: Result) {
  switch (result) {
    case Result.Success:
      return "Success!";
    case Result.TooSlow:
      return "Too slow!";
    case Result.Wrong:
      return "You pressed a wrong key!";
    case Result.NotFinished:
      return "";
    default:
      return "Something went wrong!";
  }
}
